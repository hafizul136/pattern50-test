// // permissions.decorator.ts
// import { SetMetadata } from '@nestjs/common';

// export const Permissions = (...permissions: string[]) =>
//     SetMetadata('permissions', permissions);

import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './roles.decorator';
import { RolesGuard } from '../../common/gurds/auth/role.guard';

export function Permissions(
    ...roles: string[]
    // eslint-disable-next-line @typescript-eslint/ban-types
): <TFunction extends Function, Y>(
    target: object | TFunction,
    propertyKey?: string | symbol,
    descriptor?: TypedPropertyDescriptor<Y>
) => void {
    return applyDecorators(
        Roles(...roles),
        // UseGuards(AuthGuard('jwt') ,RolesGuard),
        UseGuards(RolesGuard, AuthGuard('jwt'))
        );
}
