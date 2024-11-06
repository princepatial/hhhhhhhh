import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class CoachOffer extends Document {
  @Prop({ type: String, required: true, maxlength: 50 })
  problemTitle: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Files', required: true })
  representativePhoto: MongooseSchema.Types.ObjectId;

  @Prop({ type: String, required: true, maxlength: 400 })
  description: string;

  @Prop({ type: Date, required: true })
  availableFrom: Date;

  @Prop({ type: [String] })
  hashtags: string[];

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Area', required: true })
  area: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: MongooseSchema.Types.ObjectId;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const CoachOfferSchema = SchemaFactory.createForClass(CoachOffer);

CoachOfferSchema.index({ createdAt: 1 });
