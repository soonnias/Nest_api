import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestTypesService } from './test-types.service';
import { TestTypesController } from './test-types.controller';
import { TestTypeSchema } from './schemas/test-type.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'TestType', schema: TestTypeSchema }])],
  controllers: [TestTypesController],
  providers: [TestTypesService],
})
export class TestTypesModule {}