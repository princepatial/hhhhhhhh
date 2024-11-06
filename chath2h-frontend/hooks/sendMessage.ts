import { ConversationContext, NewChatInvitationType, NewMessage } from 'globalTypes';
import { TFunction } from 'i18next';
import { declineChatRequest } from 'queries/chatRequestQuery/chatRequest';
import { sendMessage } from 'queries/messagesQuery/messagesQuery';

export const onSendMessage = async (
  item: NewChatInvitationType,
  t: TFunction<'common', undefined>,
  userId: string
) => {
  const isNeed = 'need' in item;
  const conversationID = (item?.need?._id || item?.coachOffer?._id) as string;
  const data: NewMessage = {
    from: userId,
    to: userId === item.coach._id ? item.user._id : item.coach._id,
    content: t('NewChatInvitation_Send_Message_Content'),
    conversationContext: isNeed ? ConversationContext.NEED : ConversationContext.COACH_OFFER,
    conversationContextId: conversationID,
    systemMessage: true
  };
  const message = await sendMessage(data);
  await declineChatRequest(item._id);
  return message;
};
