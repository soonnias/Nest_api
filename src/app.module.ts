import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TestTypesModule } from './test-types/test-types.module';
import { PatientModule } from './patients/patient.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/api_med_db'),
    TestTypesModule,
    PatientModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
