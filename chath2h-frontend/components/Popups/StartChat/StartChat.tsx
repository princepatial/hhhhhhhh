import Dialog from '@components/Dialog';
import {getGlobalState, setGlobalState} from 'globalState';
import {
    ConversationContext,
    Need,
    NewMessage,
    Offer,
    Query,
    StartChatRequest,
    StateSetterType,
    User
} from 'globalTypes';
import BuyNewTokensPopup from '../BuyNewTokensPopup';
import ConfirmPopup from '../ConfirmPopup';
import PayEarnInfoPopup from '../PayEarnInfoPopup';

import axios from 'axios';
import {separatorTranslate} from 'helpers';
import {checkIfUserHasTokens} from 'hooks/checkIfUserHasTokens';
import {askForApproval, getContractApprove} from 'hooks/onchainActivities';
import {useLoadingTracker} from 'hooks/useLoadingTracker';
import useUserActivityStatus from 'hooks/useUserActivityStatus';
import {useTranslation} from 'next-i18next';
import {useRouter} from 'next/router';
import {newChatRequest} from 'queries/chatRequestQuery/chatRequest';
import {sendMessage} from 'queries/messagesQuery/messagesQuery';
import {useEffect, useState} from 'react';

type Props = {
    needOffer?: Need | Offer;
    isNeedPage?: boolean;
    setIsPayEarnPopupOpen: StateSetterType<boolean> | ((value: boolean) => void);
    setIsCoachPopup: StateSetterType<boolean | undefined>;
    isPayEarnPopupOpen: boolean;
    otherUser?: User;
};

const StartChat = ({
                       needOffer,
                       isNeedPage,
                       setIsPayEarnPopupOpen,
                       isPayEarnPopupOpen,
                       otherUser,
                       setIsCoachPopup
                   }: Props) => {
    const user = getGlobalState('user');
    const {t} = useTranslation('common');
    const {isLoading, ltrack} = useLoadingTracker();
    const router = useRouter();

    const activeNeedOfferUserStatus = useUserActivityStatus(
        otherUser?._id || needOffer?.user?._id || ''
    );

    const [isUserOfflineBusyPopupOpen, setIsUserOfflineBusyPopupOpen] = useState(false);
    const [isBuyTokensOpen, setIsBuyTokensOpen] = useState(false);
    const [isRequestorOnChat, setIsRequestorOnChat] = useState<boolean>(false);
    const isMyNeedOffer = user?._id === needOffer?.user._id;

    useEffect(() => {
        const isCoachPopup = !otherUser ? isNeedPage : isNeedPage && !isMyNeedOffer;
        setIsCoachPopup(!!isCoachPopup);
    }, [otherUser, isNeedPage, isMyNeedOffer]);

    const getOnchainConditions = () => {
        let result = {
            isUserStartChat: false,
            isOnchain: false
        };

        const needOfferUser = needOffer?.user;

        if (user && needOfferUser && otherUser) {
            const coach = isNeedPage
                ? user._id === needOfferUser._id
                    ? otherUser
                    : user
                : needOfferUser;
            const student = isNeedPage
                ? needOfferUser
                : user._id === needOfferUser._id
                    ? otherUser
                    : user;

            result.isOnchain = !!(student.walletAddress && coach.walletAddress);
            result.isUserStartChat = user._id !== coach._id;
        }

        return result;
    };

    const {isUserStartChat, isOnchain} = getOnchainConditions();
    const sendApprovalRequest = askForApproval(user);
    const contractApprove = getContractApprove();

    const onUserOfflineBusy = async () => {
        if (user && needOffer) {
            const data: NewMessage = {
                from: user._id,
                to: !otherUser ? needOffer.user._id : otherUser._id,
                content: `User_offline_busy_1${separatorTranslate}${needOffer.problemTitle}${separatorTranslate}User_offline_busy_2`,
                conversationContext: isNeedPage
                    ? ConversationContext.NEED
                    : ConversationContext.COACH_OFFER,
                conversationContextId: needOffer._id,
                systemMessage: true
            };

            const message = await sendMessage(data);
            setIsUserOfflineBusyPopupOpen(false);
            setIsPayEarnPopupOpen(false);

            const query = {
                conversationId: message.existingConversationId
            };

            router.push({
                pathname: '/mailbox',
                query
            });
        }
    };

    const handleStartChat = async () => {
        const needOfferUser = needOffer?.user._id;
        const otherUserId = otherUser?._id;
        if (user && needOfferUser) {
            const otherUser = otherUserId && isMyNeedOffer ? otherUserId : user?._id;
            const coachId = isNeedPage ? otherUser : needOfferUser;
            const userId = isNeedPage ? needOfferUser : otherUser;

            const query: Query = {
                id: '',
                coachId: coachId,
                initiatorId: user._id,
                userId: userId
            };

            const requestData: StartChatRequest = {user: userId, coach: coachId};

            if (isNeedPage) {
                requestData.need = needOffer?._id;
                query.need = needOffer?._id;
            } else {
                requestData.coachOffer = needOffer?._id;
                query.offer = needOffer?._id;
            }

            if (isUserStartChat && isOnchain && sendApprovalRequest) {
                try {
                    await contractApprove.writeAsync?.();
                } catch (error) {
                    console.log(error);
                    setIsPayEarnPopupOpen(false);
                    return;
                }
            }

            const responseData = await newChatRequest(requestData);

            if (!responseData?.requestId) return;

            query.id = responseData.requestId;
            setGlobalState('chatQuery', query);
            router.push('/chat');
        }
    };

    const checkConditionsAndStartChat = ltrack(async () => {
        if (isLoading) return;

        if (activeNeedOfferUserStatus === 'Offline') {
            setIsUserOfflineBusyPopupOpen(true);
            return;
        }

        let userData;

        try {
            const {data} = await axios.get(`/users/${needOffer?.user?._id}`);
            userData = data;
        } catch (error) {
            console.log('Error while getting about user is in chat', error);
        }
        if (userData?.isInChat) {
            setIsRequestorOnChat(true);
            setIsUserOfflineBusyPopupOpen(true);
            return;
        }

        if (activeNeedOfferUserStatus === 'Online') {
            setIsRequestorOnChat(false);
            //ask for tokens only if on need you are user(owner) and on offer you are not the user(owner)
            if ((isNeedPage && isMyNeedOffer) || (!isNeedPage && !isMyNeedOffer)) {
                const hasTokensToStartChat = await checkIfUserHasTokens();
                if (hasTokensToStartChat) {
                    handleStartChat();
                } else {
                    setIsBuyTokensOpen(true);
                }
            } else {
                handleStartChat();
            }
        }
    });

    useEffect(() => {
        if (isPayEarnPopupOpen) {
            checkConditionsAndStartChat();
        } else {
            setIsUserOfflineBusyPopupOpen(false);
            setIsBuyTokensOpen(false);
        }
    }, [isPayEarnPopupOpen]);

    return (
        <>
            <Dialog
                isOpen={isUserOfflineBusyPopupOpen}
                handleClose={() => {
                    setIsUserOfflineBusyPopupOpen(false);
                    setIsPayEarnPopupOpen(false);
                }}>
                <ConfirmPopup
                    rightButtonEvent={onUserOfflineBusy}
                    rightButton={t('Chat_send_message')}
                    leftButtonEvent={() => {
                        setIsUserOfflineBusyPopupOpen(false);
                        setIsPayEarnPopupOpen(false);
                    }}
                    title={
                        needOffer?.user?.firstName +
                        ' is ' +
                        (isRequestorOnChat ? t('UserActivityStatus_Busy') : t('UserActivityStatus_Offline'))
                    }
                    subTitle={`${t('UserActivityStatus_send_message')} ${needOffer?.user?.firstName}?`}
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
        </>
    );
};

export default StartChat;
