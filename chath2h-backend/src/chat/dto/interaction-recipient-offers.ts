import { CoachOffer } from 'src/coach-offer/entity/coach-offer.entity';
import { NeedOffer } from 'src/needs/entities/need.entity';

export class InteractionRecipient {
  _id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  updatedAt: Date;
}

export default class InteractionRecipientOffers {
  interactionRecipient: InteractionRecipient;
  needOffers: NeedOffer[] | CoachOffer[];
}
