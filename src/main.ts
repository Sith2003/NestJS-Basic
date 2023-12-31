import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/v1')
  app.useGlobalPipes(new ValidationPipe())
  app.enableCors()
  app.use(helmet())

  await app.listen(process.env.PORT);
}
bootstrap();
