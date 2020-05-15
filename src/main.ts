import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ValidationError } from '@nestjs/common';
import { UnprocessableEntityException } from './helpers/unprocessable-entity-exception.interface';
import { useContainer } from 'class-validator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    },
    whitelist: false,
    exceptionFactory: (errors: ValidationError[]) => {
      throw UnprocessableEntityException.fromValidationErrorArray(errors);
    }
  }));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(3000);
}
bootstrap();
