import { Injectable, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { TestType } from './test-type.interface';
import { CreateTestTypeDto } from './dto/create-test-type.dto';

@Injectable()
export class TestTypesService {
    constructor(@InjectModel('TestType') private readonly testTypeModel: Model<TestType>) {}

    async getAllTestTypes(): Promise<TestType[]> {
        return this.testTypeModel.find().exec();
    }

    async getTestTypeById(id: string): Promise<TestType> {
        const testType = await this.testTypeModel.findById(id).exec();
        if (!testType) {
            throw new NotFoundException("Test type with ID ${id} not found");
        }
        return testType;
    }

    async addTestType(createTestTypeDto: CreateTestTypeDto): Promise<TestType> {
        const newTestType = new this.testTypeModel(createTestTypeDto);
        return newTestType.save();
    }

    async updateTestType(id: string, createTestTypeDto: CreateTestTypeDto): Promise<TestType> {
        const updatedTestType = await this.testTypeModel
            .findByIdAndUpdate(id, createTestTypeDto, { new: true })
            .exec();
        if (!updatedTestType) {
            throw new NotFoundException("Test type with ID ${id} not found");
        }
        return updatedTestType;
    }

    async deleteTestType(id: string): Promise<{ message: string }> {
        const deletedTestType = await this.testTypeModel.findByIdAndDelete(id).exec();
        if (!deletedTestType) {
            throw new NotFoundException("Test type with ID ${id} not found");
        }
        return { message: 'Test type deleted successfully' };
    }
}