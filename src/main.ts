import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as winston from 'winston';
import { WinstonModule } from 'nest-winston';
import { transports } from 'winston';

async function bootstrap() {
  const appOptions = {
    cors: true,
    logger: WinstonModule.createLogger({
      transports: [
        new winston.transports.Console({ level: 'debug' }),
        new winston.transports.File({
          filename:
            'logs/Combined-' + new Date(Date.now()).toDateString() + '.log',
          level: 'info',
          handleExceptions: true,
        }),
        new winston.transports.File({
          filename:
            'logs/Errors-' + new Date(Date.now()).toDateString() + '.log',
          level: 'error',
        }),
      ],
      exceptionHandlers: [
        new transports.File({ filename: 'logs/exceptions.log' }),
      ],

      format: winston.format.combine(
        winston.format.timestamp({
          format: 'DD/MM/YYYY, HH:mm:ss',
        }),
        winston.format.printf(
          (error) =>
            `[Nest] 5277   - ${[error.timestamp]}  [${error.context}] :  ${
              error.level
            }: ${error.message}`,
        ),
      ),
    }),
  };
  const app = await NestFactory.create(AppModule, appOptions);

  app.setGlobalPrefix('api');

  const options = new DocumentBuilder()
    .setTitle('xxx')
    .setDescription('xxx')
    .setVersion('1.0')
    .setBasePath('api')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);

  await app.listen(3000);
}
bootstrap();
