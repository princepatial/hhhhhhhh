import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { AdsLocation } from '../types/ads-enums';

@Schema()
export class Ad extends Document {
  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  redirectPath: string;

  @Prop({ type: String })
  imagePath: string;

  @Prop({ type: Number, default: 0 })
  visits: number;

  @Prop({ type: Number, default: 0 })
  views: number;

  @Prop({ type: Number })
  position: number;

  @Prop({ type: String, enum: AdsLocation })
  location: AdsLocation;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Files', required: true })
  image: MongooseSchema.Types.ObjectId;
}

export const AdSchema = SchemaFactory.createForClass(Ad);
