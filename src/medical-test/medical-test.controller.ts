import { Controller, Get, Post, Patch, Delete, Body, Param, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MedicalTestService } from './medical-test.service';
import { CreateMedicalTestDto, UpdateMedicalTestDto } from './dto/medical-test.dto';
import { Types } from 'mongoose';
import { PatientService } from 'src/patients/patient.service';
import { Schema } from 'mongoose';

@ApiTags('Medical Tests')
@Controller('medical-tests')
export class MedicalTestController {
  constructor(private readonly medicalTestService: MedicalTestService,
    private readonly patientService: PatientService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Створити новий медичний тест' })
  @ApiResponse({ status: 201, description: 'Медичний тест створено' })
  @ApiResponse({ status: 404, description: 'Користувач або тип тесту не знайдено' })
  async create(@Body() createMedicalTestDto: CreateMedicalTestDto) {
    try {
      return await this.medicalTestService.create(createMedicalTestDto);
    } catch {
      throw new NotFoundException('Error. Not found type of test or patient.');
    }
  }

  @Get()
  @ApiOperation({ summary: 'Отримати всі медичні тести' })
  @ApiResponse({ status: 200, description: 'Список тестів' })
  async findAll() {
    try {
      return await this.medicalTestService.findAll();
    } catch (error) {
      throw new InternalServerErrorException('Помилка при отриманні списку тестів');
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати медичний тест за ID' })
  @ApiResponse({ status: 200, description: 'Медичний тест знайдено' })
  @ApiResponse({ status: 404, description: 'Медичний тест не знайдено' })
  async findById(@Param('id') id: string) {
    try {
      return await this.medicalTestService.findById(id);
    } catch {
      throw new NotFoundException('Test not found');
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Оновити результат або рекомендації тесту' })
  @ApiResponse({ status: 200, description: 'Тест оновлено' })
  @ApiResponse({ status: 404, description: 'Медичний тест не знайдено' })
  async update(@Param('id') id: string, @Body() updateDto: UpdateMedicalTestDto) {
    try {
      return await this.medicalTestService.update(id, updateDto);
    } catch {
      throw new NotFoundException('Test not found');
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити медичний тест' })
  @ApiResponse({ status: 200, description: 'Тест видалено' })
  @ApiResponse({ status: 404, description: 'Медичний тест не знайдено' })
  async delete(@Param('id') id: string) {
    try {
      return await this.medicalTestService.delete(id);
    } catch{
      throw new NotFoundException('Test not found');
    }
  }

  @Get('patient/:userId')
@ApiOperation({ summary: 'Отримати всі тести пацієнта' })
@ApiResponse({ status: 200, description: 'Список тестів пацієнта' })
@ApiResponse({ status: 404, description: 'Користувача не знайдено' })
async findByUserId(@Param('userId') userId: string) {
  try {
    return await this.medicalTestService.findByUserId(userId);
  } catch (error) {
    throw new NotFoundException('User not found');
  }
}



}
