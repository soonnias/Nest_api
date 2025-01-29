import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TestTypesController } from './test-types/test-types.controller';
import { TestTypesService } from './test-types/test-types.service';
import { TestTypesModule } from './test-types/test-types.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/api_med_db'),
    TestTypesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
