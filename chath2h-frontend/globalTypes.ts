import { TLanguageCode } from 'countries-list';
import { Dispatch, SetStateAction } from 'react';

export type Enum = { [key: string]: string };

export type AgeValue = {
  from: number;
  to?: number;
};

export type SelectOptions = {
  value?: string | number;
  label: string | number;
  range?: AgeValue;
};

export type SortBy = {
  label: string;
  value?: { createdAt: 1 | -1 };
};

export type Language = {
  value: string;
  label: string;
};

export type Gender = 'Man' | 'Woman' | 'Other';

export enum GenderNames {
  MAN = 'gender_name_man',
  WOMAN = 'gender_name_woman',
  NOT_SPECIFIED = 'gender_name_not_specified'
}

export enum ConversationType {
  WELCOME_MSG = 'welcomeMsg'
}

export const gendersTranslate: { [key: string]: string } = {
  Man: 'gender_name_man',
  Woman: 'gender_name_woman',
  Other: 'gender_name_not_specified'
};

export type EducationNames =
  | 'Primary'
  | 'Secondary'
  | 'JuniorHigh'
  | 'High'
  | 'Higher'
  | 'Bachelor'
  | 'Master'
  | 'Doctor';

export const educationNamesTranslate: { [key: string]: string } = {
  Primary: 'education_name_primary',
  Secondary: 'education_name_secondary',
  JuniorHigh: 'education_name_junior_high',
  High: 'education_name_high',
  Higher: 'education_name_higher',
  Bachelor: 'education_name_bachelor',
  Master: 'education_name_master',
  Doctor: 'education_name_doctor'
};

export type MaritalStatus = 'Divorced' | 'Married' | 'Widowed' | 'Single' | 'Separated';

export const maritalStatusTranslate: { [key: string]: string } = {
  Single: 'martial_status_single',
  Married: 'martial_status_married',
  Divorced: 'martial_status_divorced',
  Widowed: 'martial_status_widowed',
  Separated: 'martial_status_separated'
};

export type ProfessionalActivity = 'Working' | 'Unemployed' | 'Retired' | 'Student';

export const professionalActivityTranslate: { [key: string]: string } = {
  Working: 'professional_activity_working',
  Unemployed: 'professional_activity_unemployed',
  Retired: 'professional_activity_retired',
  Student: 'professional_activity_student'
};

export enum VisitedSection {
  COACH = 'Coach',
  NEED = 'Need',
  OFFER = 'Offer'
}

export enum AdsLocation {
  OFFERS = 'offers',
  OFFERS_SMALL = 'offers-small',
  NEEDS = 'needs',
  NEEDS_SMALL = 'needs-small',
  COACHES = 'coaches',
  COACHES_SMALL = 'coaches-small',
  MY_TOKENS = 'my-tokens',
  NIKU = 'niku'
}

export type AdsLocationType =
  | 'offers'
  | 'offers-small'
  | 'needs'
  | 'needs-small'
  | 'coaches'
  | 'coaches-small'
  | 'my-tokens'
  | 'niku';

export type Photo = {
  fieldname?: string;
  originalname?: string;
  encoding?: string;
  mimetype?: string;
  filename: string;
  destination?: string;
  path?: string;
  size?: number;
};

export type CoachPage = {
  categories: Category[];
  coachProfile: CoachProfile;
  firstName: string;
  lastName?: string;
  offersCount: number;
  _id: string;
  user: User;
  isFollowed?: boolean;
};

type CoachProfile = {
  about: string;
  coachCompetence: string;
  coachPhoto?: Photo;
};

export type H2HToken = {
  address: string;
  adminWalletAddress: string;
  startingAmount: string;
};

export type User = {
  _id: string;
  email: string;
  firstName: string;
  lastName?: string;
  gender: Gender;
  age: number;
  language: string[];
  country: string;
  city: string;
  education: string;
  maritalStatus?: MaritalStatus;
  occupation?: string;
  professionalActivity?: ProfessionalActivity;
  tokens?: number;
  admin: boolean;
  lastViewedUrls?: LastViewedItem[];
  avatar: Photo;
  coachProfile: CoachProfile;
  areas?: string[] | Category[];
  isDisabled?: boolean;
  refLink: string;
  walletAddress: string;
  isWelcomeMessageRead: boolean;
};

export type Category = {
  _id: string;
  name: string;
  image: string;
  areas?: string[];
  isDisabled?: boolean;
  walletAddress: string;
};

export type HelpFormValues = {
  image?: string;
  title: string;
  hashtags: string[];
  description: string;
  availableFrom?: Date;
};

export type Area = {
  image: string;
  name: string;
  _id: string;
};

export type AreaResponse = {
  _id: string;
  name: string;
  areaImage: string;
  needOffersCount: number;
  helpOffersCount: number;
  imageSrc?: string;
  translation: {
    [lang: string]: string;
  }[];
  translateName?: string;
};

export type Need = {
  chats?: Array<string>;
  area: Area;
  problemTitle: string;
  description: string;
  image: Photo;
  hashtags?: [string];
  updatedAt: Date;
  user: User;
  _id: string;
  isActive?: boolean;
  availableFrom: Date;
};

export type Offer = {
  chats?: Array<string>;
  problemTitle: string;
  description: string;
  availableFrom: Date;
  hashtags?: [string];
  representativePhoto: Photo;
  user: User;
  area: Area;
  _id: string;
  isActive?: boolean;
};

export type ActiveComponents = 'coachDetails' | 'needDetails' | 'offerDetails' | null;

export enum ActiveComponentsDetailsEnum {
  COACH = 'coachDetails',
  NEED = 'needDetails',
  OFFER = 'offerDetails'
}

export type PaginateUser = {
  users: User[];
  totalPages: number;
  page?: number;
  hasNextPage: boolean;
  skip?: number;
  hasPrevPage?: boolean;
  limit?: number;
};

export type PagePagination<TDoc> = {
  docs: TDoc[];
  totalPages: number;
  page?: number;
  hasNextPage: boolean;
  skip?: number;
  coaches?: CoachesWithCategories[];
};

export type OffersPagePagination = {
  docs: Offer[];
  totalPages: number;
  page: number;
};

export type CoachesWithCategory = {
  areas: Area;
  user: User;
};
export type CoachesWithCategories = {
  areas: Area[] | string[];
  user: User;
  isFollowed?: boolean;
};

export type Advertisement = {
  _id: string;
  name: string;
  redirectPath: string;
  imagePath: string;
  visits?: number;
  views?: number;
  image: Photo;
  location: string;
  imageSrc?: string;
};

export type AdvertFormValues = {
  name: string;
  redirectPath: string;
  image: any;
};

export type LastViewedItem = {
  userName: string;
  avatar: string;
  areas: string | string[];
  type: VisitedSection;
  title?: string;
  path?: string;
  id: string;
};

export type LastViewedItems = {
  lastViewedItems?: LastViewedItem[];
};
export type MyNeedsAndOffers = {
  _id: string;
  needs: Need[];
  offers: Offer[];
};

export type StateSetterType<T> = Dispatch<SetStateAction<T>>;

export type PageViewState = 'needs' | 'offers' | null;
export enum PageViewStateEnum {
  NEEDS = 'needs',
  OFFERS = 'offers'
}

export type FavoriteCoaches = User[];

export type DashboardType = {
  _id: string;
  email: string;
  firstName: string;
  lastName?: string;
  gender: Gender;
  age: number;
  language: string[];
  country: string;
  city: string;
  education: string;
  maritalStatus?: MaritalStatus;
  occupation?: string;
  professionalActivity?: ProfessionalActivity;
  tokens?: number;
  admin?: boolean;
  lastViewedUrls?: LastViewedItem[];
  avatar: Photo;
  coachProfile: CoachProfile;
  suggestedOffers: Offer[];
  suggestedNeeds: Need[];
  favoriteCoaches: CoachesWithCategories[];
  myNeedsAndOffers: MyNeedsAndOffers;
};

export type TokenTransactionType =
  | 'BUY'
  | 'SPENT_CHAT'
  | 'EARN_CHAT'
  | 'NEW_USER'
  | 'ADMIN_GRANTED'
  | 'REF_LINK'
  | 'REF_LINK'
  | 'OUTDATED_FREE';

export const tokenTransactionTypeTranslate: { [key: string]: string } = {
  BUY: 'my-tokens_buy_title',
  SPENT_CHAT: 'my-tokens_spent_chat_title',
  EARN_CHAT: 'my-tokens_earn_chat_title',
  NEW_USER: 'my-tokens_new_user_title',
  ADMIN_GRANTED: 'my-tokens_admin_granted_title',
  REF_LINK: 'my-tokens_ref_link_title',
  OUTDATED_FREE: 'my-tokens_outdated_free_title'
};

export enum TokenTransactionKind {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT'
}

export type TokensTransaction = {
  amount: number;
  createdAt: Date;
  kind: TokenTransactionKind;
  type: TokenTransactionType;
};
export type Message = {
  from: string | User;
  content: string;
  to: string | User;
  systemMessage?: boolean;
  viewed?: boolean;
  createdAt?: string;
  id?: string;
  conversationContext?: ConversationContext;
  conversationContextId?: string;
  _id?: string;
};

export type CoachNeedOffer = {
  problemTitle: string;
  id: string;
};

export type Recipient = {
  avatar: Photo;
  id: string;
  firstName: string;
  coachProfile?: CoachProfile;
};

export type Conversation = {
  messagesNotViewed: number;
  coachOffer?: Offer;
  need?: Need;
  messages: Message[];
  messagesLimit: number;
  createdAt: string;
  updatedAt: string;
  isBlocked: boolean;
  id: string;
  participant1: User;
  participant2: User;
  messagesCount: number;
  owner?: string;
  userMessageLimit?: number;
};

export type Thread = {
  recipient: Recipient;
  conversations: Conversation[];
};

export type UnreadMessagesRequest = {
  channelPostfix: string;
  channelPrefix: string;
  count: number;
  recipient: string;
};

export declare enum InteractionRequestStatus {
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED'
}

type ChatOfferOrNeed = { _id: string; problemTitle: string; avatar: Photo };

export type NewChatInvitationType = {
  _id: string;
  coach: User;
  conversation?: string;
  createdAt: Date;
  updatedAt: Date;
  initiator: string;
  need?: ChatOfferOrNeed;
  coachOffer?: ChatOfferOrNeed;
  user: User;
  status: InteractionRequestStatus;
};

export enum ConversationContext {
  COACH_OFFER = 'coachOffer',
  NEED = 'need'
}

export type NewMessage = {
  from: string;
  to: string;
  content: string;
  conversationContext: ConversationContext;
  conversationContextId: string;
  systemMessage?: boolean;
};
export type Selected = {
  conversation?: Conversation | ConversationType.WELCOME_MSG;
  recipient?: Recipient;
};

export type Query = {
  id: string;
  need?: string;
  offer?: string;
  coachId?: string;
  initiatorId?: string;
  startChat?: boolean;
  interactionStartDate?: Date;
  interactionId?: string;
  userId?: string;
};

export enum View {
  WAITING = 'waiting',
  NOT_RESPONDING = 'notResponding',
  CONVERSATION = 'conversation'
}
export type ButtonColor =
  | 'green'
  | 'red'
  | 'grey'
  | 'whiteGreen'
  | 'whiteRed'
  | 'limeGreen'
  | 'black';

export type JoinChat = {
  initiator: string;
  user: string;
  coach: string;
  need?: string;
  coachOffer?: string;
  conversation?: string;
};

export type StartChatRequest = {
  user: string;
  coach: string;
  need?: string;
  coachOffer?: string;
};

export type GetMessage = {
  from: string;
  interactionId: string;
  content: string;
  to: string;
};

export enum DialogStep {
  TIME_END = 'timeEnd',
  END = 'end',
  BUY = 'buy'
}

export type UserStatus = 'Online' | 'Busy' | 'Offline';

export enum needOfferLink {
  NEEDS = 'needs',
  OFFERS = 'coach-offer'
}

export enum needOfferPath {
  NEEDS = 'needs',
  OFFERS = 'offers',
  COACH = 'coaches'
}
export type requestDataOfferNeed = {
  problemTitle?: string;
  description?: string;
  availableFrom?: Date;
  hashtags?: string[];
  representativePhoto?: Photo;
  image?: Photo;
  user?: User;
  area?: string;
  isActive?: boolean;
};

export type FilterDataType = 'COACH' | 'COACH_OFFER' | 'NEED';

export enum FilterEnumType {
  COACH = 'COACH',
  COACH_OFFER = 'COACH_OFFER',
  NEED = 'NEED'
}

export type FiltersNeedOffer = {
  user?: {
    _id?: string;
    gender?: string | number;
    age?: AgeValue;
    firstName?: string;
    language?: string | number;
  };
  area?: {
    name?: string | number;
  };
  _id?: string;
};

export type FiltersCoach = {
  area?: {
    name?: string | number;
  };
  _id?: string;
  language?: string | number;
  gender?: string | number;
  age?: AgeValue;
  firstName?: string;
};
export enum StepOfferForm {
  FORM = 'form',
  CALENDAR = 'calendar'
}

export type InteractionRecipient = {
  _id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  updatedAt: Date;
};

export type SingleNeedOffer = {
  needOffer: Offer | Need;
  interactionRecipients: [InteractionRecipient];
};

export type InteractionRecipent = {
  _id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  updatedAt: Date;
};

export type InteractionRecipientOffers = {
  interactionRecipient: InteractionRecipent;
  needOffers: Offer[] | Need[];
};

export type userIdNeedId = {
  id: string;
  idNeed: string;
  title?: string;
  isNeed?: boolean;
};

export type StatisticDataKeys =
  | 'activityStatusCounts'
  | 'ageCounts'
  | 'countryCounts'
  | 'genderCounts'
  | 'languageCounts'
  | 'maritalStatusCounts'
  | 'professionalActivityCounts';

export type StatisticCount = {
  _id: TLanguageCode;
  count: number;
  name?: string;
};

export type StatisticData = {
  k: string;
  v: StatisticCount[];
};

export type SingleCoach = {
  firstName: string;
  rate: number;
  ratingsCount: number;
  coachProfile: {
    about: string;
    coachCompetence: string;
    coachPhoto: {
      filename: string;
    };
  };
};
