import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TestTypesModule } from './test-types/test-types.module';
import { PatientModule } from './patients/patient.module';

import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/api_med_db'),
    TestTypesModule,
    PatientModule,
    ConfigModule.forRoot({
      isGlobal: true,  // Ці змінні будуть доступні по всьому проекту
    }),
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
