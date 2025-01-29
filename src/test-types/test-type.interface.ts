import { Document } from 'mongoose';

export interface TestType extends Document {
    readonly name: string;
}