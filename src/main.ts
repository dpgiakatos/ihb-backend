import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ValidationError } from '@nestjs/common';
import { UnprocessableEntityException, UnprocessableEntitySchema } from './helpers/UnprocessableEntityException';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({
    whitelist: false,
    exceptionFactory: (errors: ValidationError[]) => {

      const mappedErrors: UnprocessableEntitySchema['failingConstraints'] = {};
      
      errors.forEach(error => {

        const constraints: UnprocessableEntitySchema['failingConstraints']['any'] = [];
        Object.keys(error.constraints).forEach(constraint => {
          constraints.push({
            constraint,
            message: error.constraints[constraint]
          });
        });

        mappedErrors[error.property] = constraints;
        
      });
      throw new UnprocessableEntityException({ failingConstraints: mappedErrors });
    }
  }));

  await app.listen(3000);
}
bootstrap();
