import { UsersService } from '@modules/users/user.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { appConfig } from 'configuration/app.config';
import mongoose from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface IJwtPayload {
    sub: string;
    username: string;
};

export interface IAccessTokenStrategyRes extends IJwtPayload {
    firstName: string;
    lastName: string;
    stripeCustomerId: string
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(private readonly userService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: appConfig.jwtAccessToken,
        });
    }
    async validate(payload: IJwtPayload): Promise<IAccessTokenStrategyRes> {
        let user = await this.userService.findOne(new mongoose.Types.ObjectId(payload['userId']))
        return {
            ...payload,
            firstName: user?.firstName ?? "",
            lastName: user?.lastName ?? "",
            stripeCustomerId: user?.stripeCustomerId ?? "",
        };
    }
}