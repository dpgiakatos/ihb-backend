import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard as PassportAuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard extends PassportAuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext) {
        const needsAuth = this.reflector.getAllAndOverride<boolean>('auth', [context.getHandler(), context.getClass()]);
        
        if (needsAuth) {
            return super.canActivate(context);
        }
        return true;
    }
}
