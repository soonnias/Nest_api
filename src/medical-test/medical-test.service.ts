import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types, Schema } from 'mongoose';
import { CreateMedicalTestDto, UpdateMedicalTestDto } from './dto/medical-test.dto';
import { MedicalTest } from './schemas/medical-test.schema';


@Injectable()
export class MedicalTestService {
    constructor(
        @InjectModel('MedicalTest') private readonly medicalTestModel: Model<MedicalTest>,
        @InjectModel('Patient') private readonly patientModel: Model<any>,
        @InjectModel('TestType') private readonly testTypeModel: Model<any>,
  ) {}

  async create(createMedicalTestDto: CreateMedicalTestDto): Promise<MedicalTest> {
    const { userId, testTypeId, testDate } = createMedicalTestDto;

    if (!Types.ObjectId.isValid(userId) || !Types.ObjectId.isValid(testTypeId)) {
      throw new NotFoundException('Невірний формат ObjectId');
    }

    const userExists = await this.patientModel.findById(userId);
    if (!userExists) {
      throw new NotFoundException('Користувач не знайдений');
    }

    const testTypeExists = await this.testTypeModel.findById(testTypeId);
    if (!testTypeExists) {
      throw new NotFoundException('Тип тесту не знайдено');
    }

    const medicalTest = new this.medicalTestModel({
      userId: new Types.ObjectId(userId),
      testTypeId: new Types.ObjectId(testTypeId),
      testDate,
      status: 'В обробці',
    });

    return medicalTest.save();
  }

  async findAll(): Promise<MedicalTest[]> {
    return this.medicalTestModel.find().populate('userId testTypeId').exec();
  }

  async findById(id: string): Promise<MedicalTest> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException('Невірний формат ObjectId');
    }

    const medicalTest = await this.medicalTestModel.findById(id).populate('userId testTypeId').exec();
    if (!medicalTest) {
      throw new NotFoundException('Тест не знайдено');
    }

    return medicalTest;
  }

  async update(id: string, updateDto: UpdateMedicalTestDto): Promise<MedicalTest> {
    const updatedTest = await this.medicalTestModel.findByIdAndUpdate(
      id,
      { ...updateDto, status: 'Виконано' },
      { new: true }
    );
  
    if (!updatedTest) {
      throw new NotFoundException('Тест не знайдено');
    }
  
    return updatedTest;
  }
  

  async delete(id: string): Promise<void> {
    const deleted = await this.medicalTestModel.findByIdAndDelete(id);
    if (!deleted) {
      throw new NotFoundException('Тест не знайдено');
    }
  }

  async findByUserId(userId: string): Promise<MedicalTest[]> {
    console.log("User ID", userId);
  
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException('Невірний формат ObjectId');
    }
  
    const userIdObjectId = new Types.ObjectId(userId);

    const tests = await this.medicalTestModel.find({ userId: userIdObjectId });
  
    if (!tests || tests.length === 0) {
      throw new NotFoundException('Тести пацієнта не знайдено');
    }
  
    return tests;
  }
}
