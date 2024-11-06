import Button from '@components/Button';
import Dialog from '@components/Dialog';
import ConfirmPopup from '@components/Popups/ConfirmPopup';
import StartChat from '@components/Popups/StartChat';
import TextAreaChat from '@components/TextAreaChat';
import {CircleIArrowRightIconComponent, TrashBinIconComponent} from '@components/icons';
import MessageBubbleIconComponent from '@components/icons/message-bubble-icon/message-bubble-icon.component';
import colorScheme from '@helpers/color-scheme';
import axios from 'axios';
import classNames from 'classnames';
import AvatarWithStatus from 'components/AvatarWithStatus';
import {useGlobalState} from 'globalState';
import {
    Conversation,
    ConversationContext,
    NewMessage,
    Recipient,
    StateSetterType
} from 'globalTypes';
import {validateMessage} from 'helpers';
import useImageUrl from 'hooks/getImageUrl';
import useUserNeedOffer from 'hooks/useUsersNeedOffer';
import {useTranslation} from 'next-i18next';
import {useEffect, useMemo, useRef, useState} from 'react';
import {toast} from 'react-toastify';
import SingleMessage from '../SingleMessage/SingleMessage';
import styles from './ThreadConversation.module.scss';
import CoachProfileButton from '@components/CoachProfileButton';
import {Tooltip} from "react-tooltip";

type Props = {
    conversation?: Conversation;
    recipient?: Recipient;
    isVisible: boolean;
    backToMessages: () => void;
    onDeleteConversation: () => void;
    helperMessageCounter: number;
    setHelperMessageCounter: StateSetterType<number>;
};

type Header = {
    recipientAvatarSrc?: string;
    recipientId?: string;
    recipientName?: string;
    conversation?: Conversation;
    isNeed?: boolean;
    isCoachPopup?: boolean;
    backToMessages: () => void;
    setIsDeletePopupOpen: StateSetterType<boolean>;
    startChatEvent: () => void;
    disabled: boolean;
    isNeedNoCoachProfile: boolean;
    isChatBlocked: boolean;
};

const DesktopHeader = ({
                           conversation,
                           isNeed,
                           setIsDeletePopupOpen,
                           startChatEvent,
                           isCoachPopup,
                           disabled,
                           isNeedNoCoachProfile,
                           isChatBlocked
                       }: Header) => {
    const {t} = useTranslation('common');
    return (
        <div className={styles.desktopHeader}>
            {!!conversation && (
                <>
                    <div className={styles.title}>
            <span className={isNeed ? styles.need : styles.offer}>
              {isNeed ? t('ThreadConversation_need_title') : t('ThreadConversation_offer_title')}
            </span>
                        <span className={styles.title}>
              {isNeed ? conversation.need?.problemTitle : conversation?.coachOffer?.problemTitle}
            </span>
                    </div>
                    <div className={styles.headerButtons}>
                        {!disabled && (
                            <button className={styles.delete} onClick={() => setIsDeletePopupOpen(true)}>
                                <TrashBinIconComponent/> {t('ThreadConversation_delete_conversation')}
                            </button>
                        )}
                        {isNeedNoCoachProfile ? (
                            <CoachProfileButton/>
                        ) : isChatBlocked ? null : (
                            <>
                                <Button
                                    text={t('ThreadConversation_start_chat')}
                                    style={styles.startChat}
                                    data-tooltip-id={isCoachPopup !== undefined && 'price-tooltip'}
                                    data-tooltip-content={isCoachPopup
                                        ? t('PayEarnInfoPopup_subtitle_coach')
                                        : t('PayEarnInfoPopup_subtitle_user')}
                                    onClick={startChatEvent}>
                                    <MessageBubbleIconComponent/>
                                </Button>
                                <Tooltip className="tooltip-index" id="price-tooltip"/>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

const MobileHeader = ({
                          conversation,
                          recipientAvatarSrc,
                          recipientId,
                          recipientName,
                          backToMessages,
                          isCoachPopup,
                          setIsDeletePopupOpen,
                          startChatEvent,
                          disabled,
                          isNeedNoCoachProfile,
                          isChatBlocked
                      }: Header) => {
    const {t} = useTranslation('common');
    return (
        !!conversation && (
            <div className={styles.mobileHeader}>
                <div className={styles.row}>
                    <button className={styles.back} onClick={backToMessages}>
                        {t('ThreadConversation_back_to_messages')}
                    </button>
                    {!disabled && (
                        <button className={styles.delete} onClick={() => setIsDeletePopupOpen(true)}>
                            <TrashBinIconComponent/> {t('ThreadConversation_delete')}
                        </button>
                    )}
                </div>
                <div className={styles.row}>
                    <div className={styles.recipient}>
                        {recipientAvatarSrc && (
                            <AvatarWithStatus imageSrc={recipientAvatarSrc} userId={recipientId}/>
                        )}
                        <span>{recipientName}</span>
                    </div>
                    {isNeedNoCoachProfile ? (
                        <CoachProfileButton/>
                    ) : isChatBlocked ? null : (
                        <button className={styles.startChat} onClick={startChatEvent}>
                            <MessageBubbleIconComponent/> {t('ThreadConversation_start_chat')}
                        </button>
                    )}
                </div>
            </div>
        )
    );
};

type FooterProps = {
    messageText: string;
    conversation?: Conversation;
    handleSend: () => Promise<void>;
    handleChangeMessage: (value: string) => void;
    error?: string;
    messageCounter?: number;
};

const DesktopFooter = ({
                           messageText,
                           conversation,
                           handleSend,
                           handleChangeMessage,
                           error,
                           messageCounter
                       }: FooterProps) => {
    const {t} = useTranslation('common');
    return (
        <div className={classNames(styles.footer, styles.desktopFooter)}>
            <div className={styles.line}/>
            <div className={styles.textAreaWrapper}>
                <div className={styles.field}>
                    <TextAreaChat
                        style={styles.textarea}
                        messageText={messageText}
                        onChange={(e) => handleChangeMessage(e.target.value)}
                        onEnterClicked={handleSend}
                        placeHolder={t('ThreadConversation_write_here')}
                    />
                    <div className={styles.infoTextArea}>
            <span>
              {t('ThreadConversation_message_limit')}
                {messageCounter || 0}/{conversation && conversation?.messagesLimit}
            </span>
                        <span>{messageText.length}/400</span>
                    </div>
                </div>
                <button
                    onClick={handleSend}
                    className={styles.sendButton}
                    disabled={!messageText || !conversation}>
                    <CircleIArrowRightIconComponent color={!conversation ? colorScheme.grey : undefined}/>
                </button>
            </div>
            {error && <span className={styles.error}>{error}</span>}
            {conversation && (messageCounter || 0) >= conversation.messagesLimit && (
                <span className={styles.error}>{t('ThreadConversation_message_limit_reached')}</span>
            )}
        </div>
    );
};

const MobileFooter = ({
                          messageText,
                          conversation,
                          handleSend,
                          handleChangeMessage,
                          error,
                          messageCounter
                      }: FooterProps) => {
    const {t} = useTranslation('common');
    return (
        <div className={classNames(styles.footer, styles.mobileFooter)}>
      <span className={styles.infoTextArea}>
        {t('ThreadConversation_message_limit')} {messageCounter || 0}/{conversation?.messagesLimit}
      </span>
            <div className={styles.textAreaWrapper}>
                <div className={styles.field}>
                    <TextAreaChat
                        style={styles.textarea}
                        messageText={messageText}
                        onChange={(e) => handleChangeMessage(e.target.value)}
                        onEnterClicked={() => handleSend()}
                        placeHolder={t('ThreadConversation_write_here')}
                    />
                    <span className={styles.maxLength}>{messageText.length}/400</span>
                </div>
                <button
                    onClick={handleSend}
                    className={styles.sendButton}
                    disabled={!messageText || !conversation}>
                    <CircleIArrowRightIconComponent color={!conversation ? colorScheme.grey : undefined}/>
                </button>
            </div>
            {error && <div className={styles.error}>{error}</div>}
            {conversation && (messageCounter || 0) >= conversation.messagesLimit && (
                <div className={styles.error}>{t('ThreadConversation_message_limit_reached')}</div>
            )}
        </div>
    );
};

const ThreadConversation = ({
                                conversation,
                                recipient,
                                isVisible,
                                backToMessages,
                                onDeleteConversation,
                                helperMessageCounter,
                                setHelperMessageCounter
                            }: Props) => {
    const {t} = useTranslation('common');
    const [user] = useGlobalState('user');
    const [isCoachProfile] = useGlobalState('isCoachProfile');
    const scrollRef = useRef<null | HTMLDivElement>(null);
    const refScrollTo = useRef<null | HTMLDivElement>(null);
    const [messageText, setMessageText] = useState('');
    const [isDeletePopupOpen, setIsDeletePopupOpen] = useState(false);
    const [error, setError] = useState<string>();
    const [messages, setMessages] = useState(conversation?.messages);
    const [isPayEarnPopupOpen, setIsPayEarnPopupOpen] = useState(false);
    const [isCoachPopup, setIsCoachPopup] = useState(undefined as boolean | undefined);
    const isUsersNeedOffer = useUserNeedOffer(conversation?.need?.user?._id!, user?._id!);
    const isNeed = !!conversation?.need;
    const isNeedNoCoachProfile = useMemo(
        () => !isUsersNeedOffer && isNeed && !isCoachProfile,
        [isUsersNeedOffer, isNeed, isCoachProfile]
    );
    const isChatBlocked = useMemo(
        () => isUsersNeedOffer && isNeed && !recipient?.coachProfile,
        [isUsersNeedOffer, isNeed, recipient?.coachProfile]
    );
    const {filename} = recipient?.avatar || {};
    const imageSrc = filename && useImageUrl(filename);

    const handleSend = async () => {
        if (!user?._id || !recipient?.id || messageText.trim().length < 1) return;
        if (
            (conversation?.userMessageLimit || 0) + helperMessageCounter >=
            (conversation?.messagesLimit || 3)
        ) {
            setError(`${t('ThreadConversation_limit_messages')}`);
        } else {
            const isValidate = validateMessage(messageText);
            if (!isValidate) {
                setError(t('Chat_not_validate_send_message'));
                return;
            } else {
                setError('');
            }
            let requestData: NewMessage = {
                from: user?._id,
                to: recipient?.id,
                content: messageText,
                conversationContext: isNeed ? ConversationContext.NEED : ConversationContext.COACH_OFFER,
                conversationContextId:
                    (isNeed ? conversation.need?._id : conversation?.coachOffer?._id) || ''
            };

            try {
                await axios.post('/mailbox', requestData);
                setMessages((prevState) => (!prevState ? [requestData] : [...prevState, requestData]));
                setHelperMessageCounter((prevState) => prevState + 1);
                setMessageText('');
            } catch (err) {
                console.log(err);
            }
        }
    };

    const handleChangeMessage = (value: string) => {
        setMessageText(value);
    };

    const closePopup = () => setIsDeletePopupOpen(false);

    const deleteConversation = async () => {
        if (!!conversation) {
            try {
                await axios.delete(`/mailbox/${conversation.id}`, {
                    headers: {'Content-Type': 'multipart/form-data'}
                });
                closePopup();
                onDeleteConversation();
            } catch (err) {
                toast.error(t('ThreadConversation_remove_conversation_error'));
                console.log(err);
            }
        }
    };

    useEffect(() => {
        setMessages(conversation?.messages);
    }, [conversation?.messages]);

    useEffect(() => {
        if (!scrollRef.current || !refScrollTo.current) return;
        scrollRef.current.scrollTo({top: refScrollTo.current.offsetTop});
    }, [scrollRef, refScrollTo, messages]);

    return (
        <>
            <Dialog isOpen={isDeletePopupOpen} handleClose={closePopup}>
                <ConfirmPopup
                    rightButtonEvent={deleteConversation}
                    leftButtonEvent={closePopup}
                    subTitle={t('ThreadConversation_popup_delete_question')}
                />
            </Dialog>
            <StartChat
                isNeedPage={isNeed}
                setIsCoachPopup={setIsCoachPopup}
                otherUser={
                    user?._id === conversation?.participant1._id
                        ? conversation?.participant2
                        : conversation?.participant1
                }
                isPayEarnPopupOpen={isPayEarnPopupOpen}
                setIsPayEarnPopupOpen={setIsPayEarnPopupOpen}
                needOffer={isNeed ? conversation.need : conversation?.coachOffer}
            />
            <div className={classNames(!isVisible && styles.isHidden, styles.container)}>
                <MobileHeader
                    startChatEvent={() => setIsPayEarnPopupOpen(true)}
                    conversation={conversation}
                    recipientAvatarSrc={imageSrc}
                    recipientId={recipient?.id}
                    isCoachPopup={isCoachPopup}
                    recipientName={recipient?.firstName}
                    backToMessages={backToMessages}
                    setIsDeletePopupOpen={setIsDeletePopupOpen}
                    disabled={conversation?.owner !== user?._id}
                    isNeedNoCoachProfile={isNeedNoCoachProfile}
                    isChatBlocked={isChatBlocked}
                />
                <DesktopHeader
                    startChatEvent={() => setIsPayEarnPopupOpen(true)}
                    isNeed={isNeed}
                    conversation={conversation}
                    isCoachPopup={isCoachPopup}
                    backToMessages={backToMessages}
                    setIsDeletePopupOpen={setIsDeletePopupOpen}
                    disabled={conversation?.owner !== user?._id}
                    isNeedNoCoachProfile={isNeedNoCoachProfile}
                    isChatBlocked={isChatBlocked}
                />
                <span className={styles.info}>{t('ThreadConversation_info')}</span>
                <div className={styles.conversation}>
                    <div className={styles.messagesList} ref={scrollRef}>
                        {!!user &&
                            conversation &&
                            messages &&
                            messages.map((message, index) => (
                                <SingleMessage
                                    isMailbox={true}
                                    key={message.id || index}
                                    message={message}
                                    coachId=""
                                    isNeed={isNeed}
                                    userId={user?._id}
                                    avatar={
                                        message.from === conversation.participant1._id
                                            ? useImageUrl(conversation.participant1.avatar.filename)
                                            : useImageUrl(conversation.participant2.avatar.filename)
                                    }
                                />
                            ))}
                        <div ref={refScrollTo}></div>
                    </div>
                    <MobileFooter
                        messageText={messageText}
                        conversation={conversation}
                        handleSend={handleSend}
                        handleChangeMessage={handleChangeMessage}
                        error={error}
                        messageCounter={(conversation?.userMessageLimit || 0) + helperMessageCounter}
                    />
                    <DesktopFooter
                        messageText={messageText}
                        conversation={conversation}
                        handleSend={handleSend}
                        handleChangeMessage={handleChangeMessage}
                        error={error}
                        messageCounter={(conversation?.userMessageLimit || 0) + helperMessageCounter}
                    />
                </div>
            </div>
        </>
    );
};

export default ThreadConversation;
