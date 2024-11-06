import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import {
  ProfessionalActivity,
  Gender,
  MaritalStatus,
  VisitedSection,
  ActivityStatus,
  EducationName,
} from 'src/types/user-enums';
import { CoachProfile, CoachProfileSchema } from './coach.entity';

export class lastViewedUrl {
  userName: string;
  avatar: string;
  areas: string | string[];
  type: VisitedSection;
  title?: string;
  path?: string;
  id: string;
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ type: String, required: true, index: { unique: true } })
  email: string;

  @Prop({ type: String, required: true })
  firstName: string;

  @Prop({ type: String })
  lastName: string;

  @Prop({ type: String, enum: Gender, required: true })
  gender: Gender;

  @Prop({ type: Number, required: true })
  age: number;

  @Prop({ type: [String], required: true })
  language: string[];

  @Prop({ type: String, required: true })
  country: string;

  @Prop({ type: String, required: true })
  city: string;

  @Prop({ type: String, enum: EducationName })
  education: EducationName;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Files', required: true })
  avatar: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, enum: MaritalStatus })
  maritalStatus: MaritalStatus;

  @Prop({ type: String })
  occupation: string;

  @Prop({ type: String, enum: ProfessionalActivity })
  professionalActivity: ProfessionalActivity;

  @Prop({ type: Number })
  tokens: number;

  @Prop({ type: Number })
  freeTokens: number;

  @Prop({ type: Boolean, default: false })
  admin: boolean;

  @Prop({ type: CoachProfileSchema })
  coachProfile: CoachProfile;

  @Prop({
    type: [{ type: MongooseSchema.Types.ObjectId, ref: 'User' }],
  })
  favoriteCoaches: MongooseSchema.Types.ObjectId[];

  @Prop({ type: Object })
  lastViewedUrls: lastViewedUrl[];

  @Prop({ type: String, enum: ActivityStatus, default: 'Offline' })
  activityStatus: string;

  @Prop({ type: String })
  walletAddress: string;

  @Prop({ type: Boolean, default: false })
  isDisabled: boolean;

  @Prop({ type: String })
  refLink: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: false })
  referrer: MongooseSchema.Types.ObjectId;

  @Prop({ type: Boolean, default: false })
  isInChat: boolean;

  @Prop({ type: Boolean, default: false })
  isWelcomeMessageRead: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
