import { ClientIDGetHelper } from '@common/helpers/getClientId.helper';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import {
    Body,
    Controller,
    Get,
    Post,
    Req,
    UseGuards
} from '@nestjs/common';
import { ClientCredentialsGuard } from 'common/gurds/auth/clientAuthentication.guard';
import mongoose from 'mongoose';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { IAuthResponse, IFullName } from './interface/auth.interface';
import { Request } from 'express';
import { ForgetPassDto } from './dto/forgetPassDto';
import { IUser } from '@modules/users/interfaces/user.interface';
import { GetUser } from '@common/decorators/getUser.decorator';
import { ResetForgotDto } from './dto/resetForgotDto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    @UseGuards(ClientCredentialsGuard)
    async signup(@Body() createUserDto: CreateUserDto, @Req() req:Request): Promise<IAuthResponse> {
        const clientId = await ClientIDGetHelper.getClientIdFromRequest(req);
        const clientObjId = new mongoose.Types.ObjectId(clientId);
        return this.authService.signUp(createUserDto, clientObjId);
    }

    @Post('sign-in')
    @UseGuards(ClientCredentialsGuard)
    async signIn(@Body() data: AuthDto, @Req() req: Request): Promise<IAuthResponse> {
        const clientId = await ClientIDGetHelper.getClientIdFromRequest(req);
        const clientObjId = new mongoose.Types.ObjectId(clientId);
        return await this.authService.signIn(data, clientObjId);
    }
    @Post('forgot-password')
    @UseGuards(ClientCredentialsGuard)
    async forgotPassword(@Body() forgetDto: ForgetPassDto, @Req() req: Request): Promise<{ user: IUser; forgetPassLink: string }> {
        const clientId = await ClientIDGetHelper.getClientIdFromRequest(req);
        const clientObjId = new mongoose.Types.ObjectId(clientId);
        return this.authService.sendForgetPasswordLink(forgetDto, clientObjId);
    }
    @Post('forgot-password/reset')
    @UseGuards(ClientCredentialsGuard)
    resetForgottenPassword(
        @Body() resetDto: ResetForgotDto
    ): Promise<boolean | any[] | IAuthResponse> {
        return this.authService.resetForgottenPassword(resetDto);
    }
    // @Post('sign-in/driver')
    // @UseGuards(ClientCredentialsGuard)
    // async signInDriver(@Body() data: AuthDto,  @Req() req:Request): Promise<IAuthResponse> {
    //     const clientId = await ClientIDGetHelper.getClientIdFromRequest(req);
    //     const clientObjId = new mongoose.Types.ObjectId(clientId);
    //     return await this.authService.signIn(data, clientObjId);
    // }
    
    // @Post('signup/driver')
    // @UseGuards(ClientCredentialsGuard)
    // async signupDriver(@Body() createUserDto: CreateUserDto,  @Req() req:Request): Promise<IAuthResponse> {
    //     const clientIdTemp = await ClientIDGetHelper.getClientIdFromRequest(req);
    //     const clientId = new mongoose.Types.ObjectId(clientIdTemp)
    //     const clientObjId = new mongoose.Types.ObjectId(clientId);
    //     const name = createUserDto?.firstName;
    //     const { firstName, lastName }: IFullName = await this.splitFullName(name);
    //     const createDriverDTO = { ...createUserDto, clientObjId, firstName, lastName, userType: UserTypeEnum.driver }
    //     return this.authService.signUp(createDriverDTO, clientId);
    // }

    async splitFullName(fullName: string): Promise<IFullName> {
        const nameParts = fullName.split(" "); // Split the full name by space

        if (nameParts.length >= 2) {
            const lastName = nameParts.pop(); // Get the last word as the last name
            const firstName = nameParts.join(" "); // Join the remaining words as the first name
            return {
                firstName: firstName,
                lastName: lastName,
            };
        } else {
            return {
                firstName: nameParts[0],
                lastName: ' ',
            };
        }
    }

    @Get('test')
    async test(): Promise<string> {
        return await this.authService.test()
    }

}