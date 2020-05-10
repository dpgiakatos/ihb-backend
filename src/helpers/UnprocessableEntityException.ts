import { UnprocessableEntityException as NativeException } from '@nestjs/common';


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
}