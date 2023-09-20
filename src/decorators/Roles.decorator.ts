import { SetMetadata } from '@nestjs/common';
import {Role} from '../enum/Role.enum';

export const ROLES_KEY = "roles";
export const Roles = (...roles: Role[]) => SetMetadata('roles', roles);