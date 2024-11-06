import { NewMessage } from 'globalTypes';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { sendMessage } from 'queries/messagesQuery/messagesQuery';
import { useEffect } from 'react';

type options = {
  isBlockedSite: boolean;
  message?: NewMessage;
  finishFunction?: () => void;
};

export const checkIfExitSite = ({ isBlockedSite, message, finishFunction }: options) => {
  const router = useRouter();
  const { t } = useTranslation('common');

  useEffect(() => {
    const confirmationMessage = t('check_if_exit_site_message');
    const secondConfirmMessage = t('check_if_exit_site_second_message');
    const beforeUnloadHandler = (e: BeforeUnloadEvent) => {
      (e || window.event).returnValue = confirmationMessage;
      return confirmationMessage;
    };

    const beforeRouteHandler = (url: string) => {
      if (router.pathname === url) return;
      const firstConfirm = confirm(confirmationMessage);
      if (firstConfirm) {
        finishFunction && finishFunction();
        if (message && confirm(secondConfirmMessage)) {
          sendMessage(message);
        }
      } else {
        router.events.emit('routeChangeError');
        throw 'You should not exit page without ending chat';
      }
    };
    if (isBlockedSite) {
      window.addEventListener('beforeunload', beforeUnloadHandler);
      router.events.on('routeChangeStart', beforeRouteHandler);
    } else {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
      router.events.off('routeChangeStart', beforeRouteHandler);
    }
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
      router.events.off('routeChangeStart', beforeRouteHandler);
    };
  }, [router, isBlockedSite]);
};
