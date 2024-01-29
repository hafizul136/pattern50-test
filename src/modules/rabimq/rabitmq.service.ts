import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { appConfig } from 'configuration/app.config';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class RabbitMQService {
    private client: ClientProxy;

    constructor() {
        this.client = ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
                urls: [appConfig.rmqURL],
                queue: 'integration_queue',
            },
        });
    }

    sendToAccounting() {
        return lastValueFrom(this.client.send({ cmd: 'accounting_connect' }, { name: "joy" }));
    }
}