// jwt-auth.guard.ts
import { AuthService } from '@modules/auth/auth.service';
import { UsersService } from '@modules/users/user.service';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { NestHelper } from 'common/helpers/NestHelper';
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {

    constructor(private readonly reflector: Reflector, private jwtService: JwtService, private userService: UsersService, private authService: AuthService) {
        super();
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const headers = context.switchToHttp().getRequest().headers;
        const au = headers.authorization;
        if (!NestHelper.getInstance().isEmpty(au)) {
            const token = au.split('Bearer ');
            const payload: any = this.jwtService.decode(token[1]);
            const user = await this.userService.findOneByEmail(payload?.username, payload?.clientId)
            if (!user) {
                return false; // User is not authenticated; deny access
            }
            const permissions = await this.authService.getPermissionsByUserRoleId(user.userRoleId)
            const requiredPermissions = this.reflector.get<string[]>(
                'permissions',
                context.getHandler(),
            );

            if (!requiredPermissions) {
                return true; // No specific permissions required; allow access
            }

            // Check if the user has the required permissions
            const hasPermission = requiredPermissions.every((permission) =>
                permissions.includes(permission),
            );

            return hasPermission;
        }
        return false
    }
}