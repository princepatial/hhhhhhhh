import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Files extends Document {
  @Prop({ type: String, required: true })
  filename: string;
  @Prop({ type: String, required: true })
  fieldname: string;
  @Prop({ type: String, required: true })
  originalname: string;
  @Prop({ type: String, required: true })
  encoding: string;
  @Prop({ type: String, required: true })
  mimetype: string;
  @Prop({ type: String, required: true })
  path: string;
  @Prop({ type: Number, required: true })
  size: number;
  @Prop({ type: String, required: true })
  destination: string;
}

export const FilesSchema = SchemaFactory.createForClass(Files);
