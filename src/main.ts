
import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import * as compression from 'compression';
import { appConfig } from 'configuration/app.config';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap():Promise<void> {
  const logger = new Logger("APP")
  const app = await NestFactory.create(AppModule, {
    cors: true,
    logger: ['error', 'warn', 'log', 'debug'],
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [appConfig.rmqURL],
      queue: 'pattern50_main_service_queue'
    },
  });

  await app.startAllMicroservices();

  const port = appConfig.port
  app.use(helmet());
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(cookieParser());
  app.use(compression());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  await app.listen(port);
  logger.log("ENV: serverType", appConfig?.serverType);
  logger.log(`Pattern50 Main Service (${appConfig.serverType}) is listening on port ${port}`);
}
bootstrap();
