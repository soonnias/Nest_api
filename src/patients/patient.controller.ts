import { Body, Controller, Delete, Get, Param, Post, HttpStatus, Res, UsePipes, ValidationPipe, NotFoundException, UseGuards, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@ApiTags('patients')
@Controller('patients')
/*@UseGuards(JwtAuthGuard)
@ApiBearerAuth()*/
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Створити нового пацієнта' })
  @ApiResponse({ status: 201, description: 'Пацієнт успішно створений' })
  @ApiResponse({ status: 400, description: 'Помилка у вхідних даних' })
  async create(@Res() res, @Body() createPatientDto: CreatePatientDto) {
    const patient = await this.patientService.createPatient(createPatientDto);
    return res.status(HttpStatus.CREATED).json({
      message: 'Patient successfully created',
      patient,
    });
  }

  @Get()
  @ApiOperation({ summary: 'Отримати всіх пацієнтів' })
  @ApiResponse({ status: 200, description: 'Успішно отримано список' })
  async getAll(@Res() res) {
    const patients = await this.patientService.getAllPatients();
    return res.status(HttpStatus.OK).json(patients);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Отримати пацієнта за ID' })
  @ApiParam({ name: 'id', description: 'ID пацієнта' })
  @ApiResponse({ status: 200, description: 'Пацієнт знайдений' })
  @ApiResponse({ status: 404, description: 'Пацієнта не знайдено' })
  async getById(@Res() res, @Param('id') id: string) {
    try{
        const patient = await this.patientService.getPatientById(id);
        return res.status(HttpStatus.OK).json(patient);
    } catch (error) {
        throw new NotFoundException('Patient not found');
    }
  }

  @Get('search/:phoneNumber')
  @ApiOperation({ summary: 'Знайти пацієнтів за номером' })
  @ApiResponse({ status: 200, description: 'Пацієнти знайдені' })
  @ApiResponse({ status: 404, description: 'Пацієнтів не знайдено' })
  async getByPhone(@Param('phoneNumber') phoneNumber: string) {
    return await this.patientService.getPatientsByPhone(phoneNumber);
  }
  

  @Delete(':id')
  @ApiOperation({ summary: 'Видалити пацієнта за ID' })
  @ApiParam({ name: 'id', description: 'ID пацієнта' })
  @ApiResponse({ status: 200, description: 'Пацієнт видалений' })
  @ApiResponse({ status: 404, description: 'Пацієнта не знайдено' })
  async delete(@Res() res, @Param('id') id: string) {
    try{
        const result = await this.patientService.deletePatient(id);
        return res.status(HttpStatus.OK).json(result);
    } catch (error) {
        throw new NotFoundException('Pation not found');
    }
  }
}
