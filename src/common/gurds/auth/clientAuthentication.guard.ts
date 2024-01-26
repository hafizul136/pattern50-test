import { ClientService } from '@modules/client/client.service';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ClientCredentialsGuard implements CanActivate {
    constructor(private clientService: ClientService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers['authorization'];

        if (!authHeader) {
            throw new UnauthorizedException('Authorization header is missing');
        } { }

        const authParts = authHeader.split(' ');

        if (authParts.length !== 2 || authParts[0].toLowerCase() !== 'basic') {
            throw new UnauthorizedException('Invalid Authorization header format');
        }

        const credentialsBase64 = authParts[1];
        const credentials = Buffer.from(credentialsBase64, 'base64').toString('utf-8');
        const [clientId, clientSecret] = credentials.split(':');

        if (!clientId || !clientSecret) {
            throw new UnauthorizedException('Invalid client credentials');
        }

        const client = await this.clientService.validateClientCredentials(clientId, clientSecret);

        if (!client) {
            throw new UnauthorizedException('Invalid client credentials');
        }

        return true;
    }
}
