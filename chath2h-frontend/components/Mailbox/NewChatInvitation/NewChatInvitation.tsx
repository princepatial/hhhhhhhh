import Button from 'components/Button';
import styles from './NewChatInvitation.module.scss';
import {useTranslation} from 'next-i18next';
import {useChatRequest} from 'queries/chatRequestQuery';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {socket} from 'socket';
import SingleThread from '../SingleThread';
import {onSendMessage} from 'hooks/sendMessage';
import {acceptChatRequest, declineChatRequest} from 'queries/chatRequestQuery/chatRequest';
import Dialog from '@components/Dialog';
import ConfirmPopup from '@components/Popups/ConfirmPopup';
import PayEarnInfoPopup from '@components/Popups/PayEarnInfoPopup';
import Timer from '../Timer';
import BuyNewTokensPopup from '@components/Popups/BuyNewTokensPopup';
import {checkIfUserHasTokens} from 'hooks/checkIfUserHasTokens';
import {NewChatInvitationType, Query, StateSetterType} from 'globalTypes';
import router, {useRouter} from 'next/router';
import {TFunction} from 'i18next';
import {useLoadingTrackerForList} from 'hooks/useLoadingTracker';
import {setGlobalState, getGlobalState} from 'globalState';
import {useSocket} from 'hooks/useSocket';
import {askForApproval, getContractApprove} from 'hooks/onchainActivities';

type Props = {
    newInvitationRequest: boolean | null;
    setSendMessageId: StateSetterType<string | null>;
    isShortcut?: boolean;
    timerEndCallback?: (chatId: string) => void;
    externalChatRequest?: NewChatInvitationType[];
};

const NewChatInvitation = ({newInvitationRequest, setSendMessageId, isShortcut, timerEndCallback, externalChatRequest}: Props) => {
    const router = useRouter();
    const {t} = useTranslation('common');
    const user = getGlobalState('user');
    const {data: chatRequest, refetch} = useChatRequest();
    const [isIgnorePopupOpen, setIsIgnorePopupOpen] = useState(false);
    const [filter, setFilter] = useState<string | null>(null);
    const {loadingData, ltrack} = useLoadingTrackerForList();
    const filteredChatRequests = useMemo(
        () => chatRequest.filter((item) => item._id !== filter),
        [filter, chatRequest]
    );
    const [isBuyTokensOpen, setIsBuyTokensOpen] = useState(false);
    const [activeItem, setActiveItem] = useState<NewChatInvitationType | null>(null);

    const getOnchainConditions = () => {
        let result = {
            isUserStartChat: false,
            isOnchain: false
        };

        if (user && activeItem) {
            const coach = activeItem.coach;
            const student = activeItem.user;

            result.isOnchain = !!(student.walletAddress && coach.walletAddress);
            result.isUserStartChat = user._id !== coach._id;
        }

        return result;
    };
    const {isUserStartChat, isOnchain} = getOnchainConditions();
    const sendApprovalRequest = askForApproval(user);
    const contractApprove = getContractApprove();

    const sockedInteractionStartedRequest = useCallback(
        async (socketResponse: any) => {
            if (activeItem) {
                const isNeed = !!activeItem.need;
                const query: Query = {
                    id: activeItem._id,
                    startChat: true,
                    interactionStartDate: socketResponse.interactionStartDate,
                    interactionId: socketResponse.interactionId,
                    userId: activeItem.user._id,
                    coachId: activeItem.coach._id
                };
                if (isNeed) {
                    query.need = activeItem.need?._id;
                } else {
                    query.offer = activeItem.coachOffer?._id;
                }
                setGlobalState('chatQuery', query);
                router.push('/chat');
            }
        },
        [activeItem]
    );

    const onRightButtonClick = ltrack('onRightButton', async (item: NewChatInvitationType) => {
        if (loadingData.onRightButton) return;

        if (item.coach._id !== user?._id) {
            const hasTokensToStartChat = await checkIfUserHasTokens();

            if (!hasTokensToStartChat) {
                setIsBuyTokensOpen(true);
                return;
            }

            if (isOnchain && sendApprovalRequest) {
                try {
                    await contractApprove.writeAsync?.();
                } catch (error) {
                    console.log(error);
                    return;
                }
            }
        }

        await acceptChatRequest(item._id, socket.id);
    });

    const sendMessage = ltrack(
        'sendMessage',
        async (item: NewChatInvitationType, t: TFunction<'common', undefined>) => {
            if (!user?._id || loadingData.sendMessage) return;
            const conversationData = await onSendMessage(item, t, user._id);
            setIsIgnorePopupOpen(false);
            refetch();
            setSendMessageId(conversationData.existingConversationId);
            if (isShortcut) {
                router.push('/mailbox');
            }
        }
    );

    const onIgnoreChat = ltrack('ignoreChat', async (id: string) => {
        if (loadingData.ignoreChat) return;
        await declineChatRequest(id);
        setIsIgnorePopupOpen(false);
        refetch();
    });

    useSocket('InteractionStartedRequest', (socketResponse) =>
        sockedInteractionStartedRequest(socketResponse)
    );
    useSocket('InteractionRequestDeclinedRequest', () => refetch());

    useEffect(() => {
        refetch();
    }, [newInvitationRequest]);

    const handleCancel = () => {
        setIsIgnorePopupOpen(true);
    }

    const handleAccept = (item: NewChatInvitationType) => {
            setActiveItem(item);
            onRightButtonClick(item);
    }

    const handleTimerEndCallback = (itemId: string) => {
        timerEndCallback && timerEndCallback(itemId);
        setFilter(itemId)
    }

    return (
        <>
            {(externalChatRequest || filteredChatRequests).map((item) => {
                const initiator = item.initiator === item.user._id ? 'user' : 'coach';
                const avatar =
                    initiator === 'user'
                        ? item.user.avatar
                        : item.coach?.coachProfile?.coachPhoto || item.coach.avatar;
                const firstName = initiator === 'user' ? item.user.firstName : item.coach.firstName;
                const conversation = [item] || [];
                const recipient = {
                    avatar,
                    id: item.initiator,
                    firstName
                };
                return (
                    <div className={styles.container} key={item._id}>
                        <div className={styles.titleTimer}>
                            <span>{t('NewChatInvitation_title')}</span>
                            <Timer time={item.createdAt} onTimeEnd={() => handleTimerEndCallback(item._id)}/>
                        </div>
                        <div className={styles.tile}>
                            <SingleThread isShortcut={isShortcut} onSelect={() => {
                            }} conversations={conversation} recipient={recipient}>
                                <div className={styles.newChat}>
                                    <span className={styles.text}>{t('SingleThread_waiting_for_new_chat')}</span>
                                    <div className={styles.buttons}>
                                        <Button
                                            buttonColor="whiteGreen"
                                            text={t('SingleThread_button_ignore')}
                                            style={styles.button}
                                            onClick={handleCancel}
                                        />
                                        <Button
                                            text={t('SingleThread_button_go_to_chat')}
                                            style={styles.button}
                                            onClick={() => handleAccept(item)}
                                        />
                                    </div>
                                    <div className={styles.shortcut_message}>
                                        {initiator !== 'coach'
                                            ? <p>{t('PayEarnInfoPopup_subtitle_coach')}</p>
                                            : <p>{t('PayEarnInfoPopup_subtitle_user')}</p>}
                                    </div>
                                </div>
                            </SingleThread>
                        </div>
                        <Dialog isOpen={isIgnorePopupOpen} handleClose={() => setIsIgnorePopupOpen(false)}>
                            <ConfirmPopup
                                showLeftButton={false}
                                disabledRight={loadingData.sendMessage}
                                title={t('NewChatInvitation_Send_Message_Popup_Title')}
                                subTitle={t('NewChatInvitation_Send_Message_Popup_Sub_Title')}
                                rightButtonColor="green"
                                rightButton={t('NewChatInvitation_Send_Message_Popup_Send_Button')}
                                rightButtonEvent={() => {
                                    sendMessage(item, t);
                                    setIsIgnorePopupOpen(false);
                                }}
                            />
                        </Dialog>
                        <BuyNewTokensPopup
                            textAfterSubTitle
                            title={t('inbox_buy_tokens_title')}
                            subTitle={t('inbox_buy_tokens_subtitle')}
                            rightButtonText={t('inbox_buy_tokens_button')}
                            isOpen={isBuyTokensOpen}
                            setIsDialogOpen={setIsBuyTokensOpen}
                        />
                    </div>
                );
            })}
        </>
    );
};

export default NewChatInvitation;
