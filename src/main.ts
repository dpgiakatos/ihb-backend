import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ValidationError } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UnprocessableEntityException } from './helpers/unprocessable-entity-exception.interface';
import * as morgan from 'morgan';

if(process.env.NODE_ENV !== 'production') {
  require('source-map-support').install();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
    whitelist: true,
    exceptionFactory: (errors: ValidationError[]) => {
      throw UnprocessableEntityException.fromValidationErrorArray(errors);
    }
  }));

  app.use(morgan('dev'));

  await app.listen(app.get(ConfigService).get<number>('port') || 3000);
}
bootstrap().catch(console.error);
