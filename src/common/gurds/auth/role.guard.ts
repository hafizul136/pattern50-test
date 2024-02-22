
import { ExceptionHelper } from '@common/helpers/ExceptionHelper';
import { NestHelper } from '@common/helpers/NestHelper';
import { AuthService } from '@modules/auth/auth.service';
import { UsersService } from '@modules/users/user.service';
import { CanActivate, ExecutionContext, ForbiddenException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { appConfig } from 'configuration/app.config';


@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector, private jwt: JwtService, private userService: UsersService, private authService: AuthService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        console.time('RolesGuard')
        let roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        // const request = context.switchToHttp().getRequest();
        const headers = context.switchToHttp().getRequest().headers;
        const au = headers.authorization;
        if (!NestHelper.getInstance().isEmpty(au)) {
            const token = au.split('Bearer ');
            try {
                this.jwt.verify(token[1], { secret: appConfig.jwtAccessToken });
            } catch (err) {
                ExceptionHelper.getInstance().defaultError('Invalid token', 'invalid_token', HttpStatus.BAD_REQUEST)
            }

            const payload: any = this.jwt.decode(token[1]);
            if (NestHelper.getInstance().isEmpty(payload)) {
                throw new UnauthorizedException();
            }
            
            const user = await this.userService.findOneData(payload?.userId)
            
            if (!user) {
                return false; // User is not authenticated; deny access
            }
            const permissions = user?.userRole?.rolePermissions?.permissions.map(e => e.name);
            const inScopes = roles.every((elem) => permissions.includes(elem))
            if (!inScopes) {
                throw new ForbiddenException();
            }
        } else {
            throw new UnauthorizedException();
        }
        console.timeEnd('RolesGuard')
        return true;
    }
}
