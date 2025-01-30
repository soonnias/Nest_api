import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class MedicalTest extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Patient', required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'TestType', required: true })
  testTypeId: Types.ObjectId;

  @Prop({ type: Date, required: true })
  testDate: Date;

  @Prop({ type: String, enum: ['В обробці', 'Виконано'], default: 'В обробці' })
  status: string;

  @Prop({ type: String, required: false })
  result?: string;

  @Prop({ type: String, required: false })
  recommendations?: string;
}

export const MedicalTestSchema = SchemaFactory.createForClass(MedicalTest);
