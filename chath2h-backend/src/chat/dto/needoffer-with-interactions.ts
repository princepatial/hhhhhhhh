import { CoachOffer } from 'src/coach-offer/entity/coach-offer.entity';
import { NeedOffer } from 'src/needs/entities/need.entity';
import { InteractionRecipient } from './interaction-recipient-offers';

export default class NeedOfferInteractions {
  needOffer: NeedOffer | CoachOffer;
  interactionRecipients: InteractionRecipient[];
}
