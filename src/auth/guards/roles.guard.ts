import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Claims, Role } from '../models/claims.interface';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const roles = this.reflector.getAllAndOverride<Role[]>('roles', [context.getHandler(), context.getClass()]);
        if (!roles) {
            return true;
        }

        const user: Claims = context.switchToHttp().getRequest().user
        if (!user) {
            throw new Error('Invalid action requires @Roles() without specifying @Auth');
        }

        return roles.some(role => {
            return user.roles.indexOf(role) !== -1;
        });
    }
}