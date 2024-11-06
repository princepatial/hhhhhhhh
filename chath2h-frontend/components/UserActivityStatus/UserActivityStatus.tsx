import React from 'react';
import styles from './UserActivityStatus.module.scss';
import classNames from 'classnames';
import useUserActivityStatus from 'hooks/useUserActivityStatus';
import { useTranslation } from 'next-i18next';

type Props = {
  userId: string;
  className: string;
};

enum Status {
  ONLINE = 'Online',
  BUSY = 'Busy',
  OFFLINE = 'Offline'
}

const UserActivityStatus = ({ userId, className }: Props) => {
  const status = useUserActivityStatus(userId);
  const { t } = useTranslation('common');

  let statusColor, displayText;

  switch (status) {
    case Status.ONLINE:
      statusColor = styles.online;
      displayText = t('UserActivityStatus_Online');
      break;
    case Status.BUSY:
      statusColor = styles.busy;
      displayText = t('UserActivityStatus_Busy');
      break;
    default:
      statusColor = styles.offline;
      displayText = t('UserActivityStatus_Offline');
      break;
  }

  return <div title={displayText} className={classNames(styles.circle, statusColor, className)} />;
};

export default UserActivityStatus;
