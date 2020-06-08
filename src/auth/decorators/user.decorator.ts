import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Claims } from '../models/claims.interface';

export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as Claims;
  }
);