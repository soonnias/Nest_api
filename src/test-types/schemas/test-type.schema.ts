import * as mongoose from 'mongoose';

export const TestTypeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

