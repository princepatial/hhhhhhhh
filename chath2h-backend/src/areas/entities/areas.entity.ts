import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
@Schema({ timestamps: true })
export class Area extends Document {
  @Prop({ type: String })
  name: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Files', required: true })
  areaImage: MongooseSchema.Types.ObjectId;

  @Prop({ type: Boolean, default: true })
  isVisible: boolean;

  @Prop([{ type: Map, of: String }])
  translation: Array<Map<string, string>>;
}
export const AreaSchema = SchemaFactory.createForClass(Area);
