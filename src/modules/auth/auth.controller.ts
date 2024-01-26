import { ClientIDGetHelper } from '@common/helpers/getClientId.helper';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { UserTypeEnum } from '@modules/users/enum/index.enum';
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
import { IAuthResponse } from './interface/auth.interface';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('signup')
    @UseGuards(ClientCredentialsGuard)
    async signup(@Body() createUserDto: CreateUserDto, @Req() req): Promise<IAuthResponse> {
        const clientId = await ClientIDGetHelper.getClientIdFromRequest(req);
        const clientObjId = new mongoose.Types.ObjectId(clientId);
        return this.authService.signUp(createUserDto, clientObjId);
    }

    @Post('signin')
    @UseGuards(ClientCredentialsGuard)
    async signIn(@Body() data: AuthDto, @Req() req): Promise<IAuthResponse> {
        const clientId = await ClientIDGetHelper.getClientIdFromRequest(req);
        const clientObjId = new mongoose.Types.ObjectId(clientId);
        return await this.authService.signIn(data, clientObjId);
    }
    @Post('signin/driver')
    @UseGuards(ClientCredentialsGuard)
    async signInDriver(@Body() data: AuthDto, @Req() req): Promise<IAuthResponse> {
        const clientId = await ClientIDGetHelper.getClientIdFromRequest(req);
        const clientObjId = new mongoose.Types.ObjectId(clientId);
        return await this.authService.signIn(data, clientObjId);
    }
    @Post('signup/driver')
    @UseGuards(ClientCredentialsGuard)
    async signupDriver(@Body() createUserDto: CreateUserDto, @Req() req): Promise<IAuthResponse> {
        const clientIdTemp = await ClientIDGetHelper.getClientIdFromRequest(req);
        const clientId = new mongoose.Types.ObjectId(clientIdTemp)
        const clientObjId = new mongoose.Types.ObjectId(clientId);
        const name = createUserDto?.firstName;
        const { firstName, lastName }: {
            firstName: string,
            lastName: string,
        } = await this.splitFullName(name);
        const createDriverDTO = { ...createUserDto, clientObjId, firstName, lastName, userType: UserTypeEnum.driver }
        return this.authService.signUp(createDriverDTO, clientId);
    }

    @Get('get-permissions')
    async getPermissions(): Promise<string[]> {
        return await this.authService.getPermissionsByUserRoleId(new mongoose.Types.ObjectId("6501900e2f99c0a2f71035b9"));
    }

    async splitFullName(fullName): Promise<{
        firstName: string,
        lastName: string,
    }> {
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
        return "Health is okay"
    }

}