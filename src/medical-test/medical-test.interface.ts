import { Types } from 'mongoose';

export interface MedicalTest {
  userId: Types.ObjectId;
  testTypeId: Types.ObjectId;
  testDate: Date;
  status: 'В обробці' | 'Виконано';
  result?: string;
  recommendations?: string;
}
