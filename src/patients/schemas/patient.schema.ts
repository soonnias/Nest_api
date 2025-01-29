import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export type PatientDocument = Patient & Document;

@Schema()
export class Patient {
  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  birthDate: Date;

  @Prop({ required: true, unique: true })
  phoneNumber: string;

  @Prop({ unique: true, sparse: true })
  email?: string;

  @Prop({ required: true}) // Ховаємо пароль при запитах  select: false
  password: string;

  @Prop({ enum: ['user', 'admin'], default: 'user' })
  role: 'user' | 'admin';

  // Віртуальне поле
  get age(): number {
    const today = new Date();
    const birthDate = new Date(this.birthDate);
    return today.getFullYear() - birthDate.getFullYear();
  }
}


export const PatientSchema = SchemaFactory.createForClass(Patient);
