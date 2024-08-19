import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  console.info(`${process.env.NODE_ENV || 'development'} is started.`);
  await app.listen(8080);
}

bootstrap();
