import { Controller, Post, Body, Get, Param, Patch, NotFoundException, Res, HttpStatus } from '@nestjs/common';
import { DiagnosisService } from './diagnosis.service';
import { CreateDiagnosisDto } from './dto/create-diagnosis.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { Types } from 'mongoose';
import { PatientService } from 'src/patients/patient.service';
import { UpdateDiagnosisDto } from './dto/update-diagnosis.dto';

@ApiTags('diagnosis')
@Controller('diagnosis')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class DiagnosisController {
  constructor(
    private readonly diagnosisService: DiagnosisService,
    private readonly patientService: PatientService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Створення нового діагнозу' })
  @ApiResponse({ status: 201, description: 'Діагноз успішно створено' })
  @ApiResponse({ status: 404, description: 'Не знайдено пацієнта' })
  async create(@Body() createDiagnosisDto: CreateDiagnosisDto) {
    //const patientIdObjectId = new Types.ObjectId(createDiagnosisDto.patientId);
    try{
        const patientExists = await this.patientService.getPatientById(createDiagnosisDto.patientId);
    }
    catch {
      throw new NotFoundException('Patient not found');
    }

    return await this.diagnosisService.create(createDiagnosisDto);
  }

   @Get()
    @ApiOperation({ summary: 'Отримати всі діагнози' })
    @ApiResponse({ status: 200, description: 'Успішно отримано список' })
    async getAll(@Res() res) {
        const diagnosis = await this.diagnosisService.getAllDiagnosis();
        return res.status(HttpStatus.OK).json(diagnosis);
    }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Отримати всі діагнози за пацієнтом' })
  @ApiResponse({ status: 404, description: 'Не знайдено пацієнта' })
  @ApiParam({ name: 'patientId', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Діагнози знайдено' })
  async getByPatientId(@Param('patientId') patientId: string) {
    try{
        const patientExists = await this.patientService.getPatientById(patientId);
        }
    catch {
        throw new NotFoundException('Patient not found');
    }
    const patientObjectId = new Types.ObjectId(patientId);

    return await this.diagnosisService.findByPatientId(patientObjectId);
  }

  @Patch(':id/description')
  @ApiOperation({ summary: 'Оновлення опису діагнозу' })
  @ApiParam({ name: 'id', description: 'Diagnosis ID' })
  @ApiResponse({ status: 200, description: 'Успішно оновлено діагноз' })
  @ApiResponse({ status: 404, description: 'Діагноз не знайдено' })
  async updateDescription(
    @Param('id') id: string, 
    @Body() updateDto: UpdateDiagnosisDto,
  ) {
    try{
        const diagnosis = await this.diagnosisService.findById(id);
    }
    catch{
      throw new NotFoundException('Diagnosis not found');
    }
  
    return await this.diagnosisService.updateDescription(id, updateDto.description);
  }
  
}
