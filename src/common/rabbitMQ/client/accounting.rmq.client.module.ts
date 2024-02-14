import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { appConfig } from './../../../configuration/app.config';
@Global() // Add the @Global() decorator to make the module global
@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'ACCOUNTING_SERVICE_RMQ', // Unique client name
                transport: Transport.RMQ,
                options: {
                    urls: [appConfig.rmqURL],
                    queue: 'p50_accounting_queue',
                    queueOptions: {
                        durable: false,
                    },
                },
                // // Add the exchange configuration here
                // exchange: 'session_exchage',
                // exchangeType: 'direct', // Specify the exchange type, e.g., 'direct', 'fanout', 'topic', etc.
            },
        ]),
    ],
    exports: [ClientsModule], // Export the module to make it available globally
})
export class AccountingRMQClientModule { }
