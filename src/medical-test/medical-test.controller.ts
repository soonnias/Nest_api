import { Controller, Get, Post, Patch, Delete, Body, Param, NotFoundException, InternalServerErrorException, UseGuards, UseInterceptors, UploadedFile, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiConsumes, ApiBody, ApiParam } from '@nestjs/swagger';
import { MedicalTestService } from './medical-test.service';
import { CreateMedicalTestDto, UpdateMedicalTestDto } from './dto/medical-test.dto';
import { Types } from 'mongoose';
import { PatientService } from 'src/patients/patient.service';
import { Schema } from 'mongoose';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { existsSync } from 'fs';

import { Response } from 'express';
import { extname } from 'path';
import * as path from 'path';

@ApiTags('Medical Tests')
@Controller('medical-tests')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
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
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Оновити результат або рекомендації тесту, з можливістю завантаження файлу' })
  @ApiParam({ name: 'id', required: true, description: 'ID медичного тесту' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        result: { type: 'string' },
        recommendations: { type: 'string' },
        file: { type: 'string', format: 'binary' },
      },
    },
  }) 
  @ApiResponse({ status: 200, description: 'Тест оновлено' })
  @ApiResponse({ status: 404, description: 'Медичний тест не знайдено' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateMedicalTestDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {

    console.log('Отриманий файл:', file);
      return await this.medicalTestService.update(id, updateDto, file);
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


@ApiOperation({ summary: 'Завантажити файл результату тесту' })
@ApiParam({ name: 'id', required: true, description: 'ID медичного тесту' })
@ApiResponse({ status: 200, description: 'Файл успішно отримано' })
@ApiResponse({ status: 404, description: 'Файл не знайдено' })
@Get(':id/download')
async downloadFile(@Param('id') id: string, @Res() res: Response) {
  const test = await this.medicalTestService.findById(id);
  if (!test || !test.filePath) {
    throw new NotFoundException('Файл не знайдено');
  }

  console.log('Шлях до файлу:', test.filePath);
  
  if (!existsSync(test.filePath)) {
    console.log('Файл не знайдено на диску');
    throw new NotFoundException('Файл не знайдено на сервері');
  }

  // Отримуємо розширення файлу
  const ext = extname(test.filePath);
  
  // Визначаємо MIME тип
  let contentType = 'application/octet-stream'; // за замовчуванням
  if (ext === '.pdf') contentType = 'application/pdf';
  if (ext === '.doc' || ext === '.docx') contentType = 'application/msword';
  // додайте інші типи за необхідності

  // Встановлюємо заголовки
  res.set({
    'Content-Type': contentType,
    'Content-Disposition': `attachment; filename="${path.basename(test.filePath)}"`,
  });

  return res.sendFile(test.filePath);
}



}
