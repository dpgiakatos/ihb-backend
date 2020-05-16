import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ValidationError } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UnprocessableEntityException } from './helpers/unprocessable-entity-exception.interface';

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

  await app.listen(app.get(ConfigService).get<number>('port'));
}
bootstrap();
