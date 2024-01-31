import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { appConfig } from 'configuration/app.config';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from './accessToken.strategy';
interface RefreshTokenValidateRes extends JwtPayload {
    refreshToken: string
}
@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
) {
    constructor(private jwtService: JwtService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: appConfig.jwtRefreshToken,
            passReqToCallback: true,
        });

    }

    validate(req: Request, payload: JwtPayload): RefreshTokenValidateRes {
        const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
        const jwtObject = this.jwtService.verify(refreshToken, { secret: appConfig.jwtAccessToken });
        if (jwtObject) {
            return { ...payload, refreshToken };
        } else {
            throw new UnauthorizedException('Invalid token');

        }
    }
}