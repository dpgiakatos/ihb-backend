import { SetMetadata } from '@nestjs/common';
import { Role } from '../models/claims.interface';

export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);