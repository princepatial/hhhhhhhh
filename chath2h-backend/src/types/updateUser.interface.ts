import { ObjectId } from 'mongoose';
import { Gender, MaritalStatus, ProfessionalActivity } from './user-enums';

export default interface UserAttrs {
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

  coachProfile: {
    about: string;
    coachCompetence: string;
    coachPhoto: ObjectId | string;
  };

  avatar: ObjectId | string;
}
