import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle('Nest API')
    .setDescription('API by Soonnias')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  if (!existsSync(join(__dirname, '..', 'uploads'))) {
    mkdirSync(join(__dirname, '..', 'uploads'));
  }

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
