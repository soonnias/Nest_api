import { Controller, Get, Post, Put, Delete, Body, Param, Res, HttpStatus, NotFoundException, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { TestTypesService } from './test-types.service';
import { CreateTestTypeDto } from './dto/create-test-type.dto';
import { TestType } from './test-type.interface';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@ApiTags('test-types')
@Controller('test-types')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TestTypesController {
    constructor(private readonly testTypesService: TestTypesService) {}
    
    @Get()
    @ApiOperation({ summary: 'Отримати всі типи тестів' })
    @ApiResponse({ status: 200, description: 'Успішно отримано список типів тестів.' })
    async getAll(@Res() res) {
        const testTypes = await this.testTypesService.getAllTestTypes();
        return res.status(HttpStatus.OK).json(testTypes);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Отримати тип тесту за id' })
    @ApiParam({ name: 'id', description: 'Ідентифікатор типу тесту' })
    @ApiResponse({ status: 200, description: 'Успішно отримано тип тесту.' })
    @ApiResponse({ status: 404, description: 'Тип тесту не знайдено' })
    async getById(@Res() res, @Param('id') id: string) {
        try {
            const testType = await this.testTypesService.getTestTypeById(id);
            return res.status(HttpStatus.OK).json(testType);
        } catch (error) {
            throw new NotFoundException('Test type not found');
        }
    }

    @Post()
    @ApiOperation({ summary: 'Створити новий тип тесту' })
    @ApiResponse({ status: 201, description: 'Тип тесту успішно створено.' })
    @ApiResponse({ status: 400, description: 'Тип тесту з такою назвою вже існує.' }) 
    async create(@Res() res, @Body() createTestTypeDto: CreateTestTypeDto) {
        try {
            const newTestType = await this.testTypesService.addTestType(createTestTypeDto);
            return res.status(HttpStatus.CREATED).json({
                message: 'Test type successfully created',
                testType: newTestType,
            });
        } catch (error) {
            if (error.code === 11000) { 
                return res.status(HttpStatus.BAD_REQUEST).json({
                    message: 'Test type with this name already exists',
                });
            }
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'Something went wrong',
            });
        }
    }

    @Put(':id')
    @ApiOperation({ summary: 'Оновити тип тесту за id' })
    @ApiParam({ name: 'id', description: 'Ідентифікатор типу тесту' })
    @ApiResponse({ status: 200, description: 'Тип тесту успішно оновлено.' })
    @ApiResponse({ status: 404, description: 'Тип тесту не знайдено або існує тест з такою назвою' })
    async update(@Res() res, @Param('id') id: string, @Body() createTestTypeDto: CreateTestTypeDto) {
        try {
            const updatedTestType = await this.testTypesService.updateTestType(id, createTestTypeDto);
            return res.status(HttpStatus.OK).json({
                message: 'Test type successfully updated ',
                testType: updatedTestType,
            });
        } catch (error) {
            throw new NotFoundException('Test type not found or test type with this name already exists');
        }
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Видалити тип тесту за id' })
    @ApiParam({ name: 'id', description: 'Ідентифікатор типу тесту' })
    @ApiResponse({ status: 200, description: 'Тип тесту успішно видалено.' })
    @ApiResponse({ status: 404, description: 'Тип тесту не знайдено' })
    async delete(@Res() res, @Param('id') id: string) {
        try {
            const deletedTestType = await this.testTypesService.deleteTestType(id);
            return res.status(HttpStatus.OK).json({
                message: 'Test type successfully deleted',
                testType: deletedTestType,
            });
        } catch (error) {
            throw new NotFoundException('Test type not found');
        }
    }
}