import { useQuery } from '@tanstack/react-query';
import {
  getSingleNeedOffer,
  getSingleNeedOfferChats,
  getSingleNeedOfferConversation
} from './singleNeedOfferQuery';
import { InteractionRecipientOffers, Message, SingleNeedOffer } from 'globalTypes';

export const useSingleNeedOffer = (id: string | undefined) =>
  useQuery<SingleNeedOffer | null, Error | null>(
    ['single-need-offer', id],
    async () => await getSingleNeedOffer(id),
    {
      enabled: !!id,
      initialData: null
    }
  );

export const useSingleNeedOfferConversation = (id: string, userId: string) =>
  useQuery<Message[] | null, Error | null>(
    ['single-need-offer-conversation', id, userId],
    async () => await getSingleNeedOfferConversation(id, userId),
    {
      enabled: !!id,
      initialData: null
    }
  );

export const useSingleNeedOfferChats = () =>
  useQuery<InteractionRecipientOffers[] | null, Error | null>(
    ['single-need-offer-chats'],
    async () => await getSingleNeedOfferChats(),
    {
      initialData: null
    }
  );
