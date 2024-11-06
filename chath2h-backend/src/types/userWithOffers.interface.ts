import { Document, ObjectId } from 'mongoose';
import {
  Gender,
  MaritalStatus,
  ProfessionalActivity,
} from 'src/types/user-enums';
import { CoachProfile } from 'src/users/entities/coach.entity';

interface UserOffer extends Document {
  representativePhoto: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
  };
  problemTitle: string;
  description: string;
  availableFrom: Date;
  hashtags: string[];
  area: ObjectId;
}

interface UserWithOffers extends Document {
  email: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  age: number;
  language: string[];
  country: string;
  city: string;
  education: string;
  maritalStatus: MaritalStatus;
  occupation: string;
  professionalActivity: ProfessionalActivity;
  tokens: number;
  admin: boolean;
  avatar: {
    fieldname: string;
    originalname: string;
    encoding: string;
    mimetype: string;
    buffer: Buffer;
    size: number;
  };
  coachProfile: CoachProfile;
  lastViewedUrls?: [
    {
      userName: string;
      area: string;
      title: string;
      path: string;
    },
  ];
  userOffers: UserOffer[];
}

export { UserWithOffers };
