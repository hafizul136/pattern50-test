import { appConfig } from 'configuration/app.config';
import { Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
@Global() // Add the @Global() decorator to make the module global
@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'OCPP_PROCESSOR_SERVICE', // Unique client name
                transport: Transport.RMQ,
                options: {
                    // urls: [config.rmqURL],
                    urls: [appConfig.rmqURL],
                    queue: 'ocpp_rpc_queue',
                    queueOptions: {
                        durable: true,
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
export class ProcessorRabbitMQClientModule { }
