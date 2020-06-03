import { UnprocessableEntityException as NativeException } from '@nestjs/common';
import { ValidationError } from 'class-validator';


export interface UnprocessableEntitySchema { 
    failingConstraints: {
        [key: string]: {
            constraint: string;
            message?: string;
        }[];
    };
}


export class UnprocessableEntityException extends NativeException {
    constructor(schema: UnprocessableEntitySchema) {
        super(schema);
    }

    static fromValidationErrorArray(errors: ValidationError[]): UnprocessableEntityException {
        const mappedErrors: UnprocessableEntitySchema['failingConstraints'] = {};
      
        errors.forEach(error => {
  
          const constraints: UnprocessableEntitySchema['failingConstraints']['any'] = [];
          Object.keys(error.constraints ?? []).forEach(constraint => {
            constraints.push({
              constraint,
              message: error.constraints![constraint]
            });
          });
  
          mappedErrors[error.property] = constraints;
          
        });
        return new UnprocessableEntityException({ failingConstraints: mappedErrors });
    }
}
