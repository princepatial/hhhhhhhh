import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
export class CoachProfile extends Document {
  @Prop({ maxlength: 50, required: true })
  about: string;

  @Prop({ maxlength: 550, required: true })
  coachCompetence: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Files', required: true })
  coachPhoto: MongooseSchema.Types.ObjectId;
}
export const CoachProfileSchema = SchemaFactory.createForClass(CoachProfile);
