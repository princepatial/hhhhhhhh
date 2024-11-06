import { MutableRefObject, useEffect, useMemo, useState } from 'react';

type Props = {
  scrollRef: MutableRefObject<HTMLDivElement | null>;
  refScrollTo: MutableRefObject<HTMLDivElement | null>;
  isMeMessaging: boolean;
  messages: Array<any>;
};

export const useScrollChat = ({ scrollRef, refScrollTo, messages, isMeMessaging }: Props) => {
  const [isTop, setIsTop] = useState(false);
  const [isBottom, setIsBottom] = useState(true);
  const [countSliceMessage, setCountSliceMessage] = useState(50);

  const messagesSliced = useMemo(
    () => messages.slice(-countSliceMessage),
    [messages, countSliceMessage]
  );

  const handleScroll = () => {
    if (!scrollRef.current) return;
    setIsTop(scrollRef.current.scrollTop <= 25);
    setIsBottom(
      Math.abs(scrollRef.current.clientHeight - (scrollRef.current.scrollHeight - scrollRef.current.scrollTop)) <= 50
    );
  };

  const scrollBottomChat = () => {
    if (!scrollRef.current || !refScrollTo.current) return;
    scrollRef.current.scrollTo({ top: refScrollTo.current.offsetTop, behavior: 'smooth' });
  };

  useEffect(() => {
    scrollRef.current?.addEventListener('scroll', handleScroll);
    return () => scrollRef.current?.removeEventListener('scroll', handleScroll);
  }, [scrollRef.current]);

  useEffect(() => {
    if (isMeMessaging || isBottom) {
      scrollBottomChat();
    }
  }, [messages, isMeMessaging]);

  useEffect(() => {
    if (messages.length > 50) {
      if (isTop && messages.length > countSliceMessage) {
        setCountSliceMessage((prevState) => prevState + 50);
      }
      if (isBottom) {
        setCountSliceMessage(50);
      }
    }
  }, [isBottom, isTop, messages]);

  return messagesSliced;
};
