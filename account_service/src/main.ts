import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    app.useGlobalPipes(new ValidationPipe());

    const HTTPServiceOn =
        configService.get<string>('MQ_PRODUCER') == 'false' && configService.get<string>('MQ_CONSUMER') == 'false' ||
        configService.get<string>('MQ_PRODUCER') == 'true' && configService.get<string>('MQ_CONSUMER') == 'true';

    const MQListenerServiceOn = configService.get<string>('MQ_CONSUMER') == 'true';

    // swagger
    if (HTTPServiceOn) {
        const config = new DocumentBuilder()
            .setTitle('Account service API')
            .setDescription('Accounts and transactions management')
            .setVersion('1.0')
            .build();
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('swagger', app, document);
    }

    if (MQListenerServiceOn) {
        console.log('starting MQ listener');
        
        app.connectMicroservice({
            transport: Transport.RMQ,
            options: {
                urls: [configService.get<string>('RABBIT_URL')],
                queue: configService.get<string>('RABBIT_QUEUE'),
                noAck: false,
                queueOptions: { durable: false },
                prefetchCount: 1,
            },
        });
        
        await app.startAllMicroservices();
    }

    if (HTTPServiceOn) {
        console.log('starting MQ producer');
        const port = process.env.PORT?+process.env.PORT:3000;
        console.log('listen to port', port);
        await app.listen(port);
    }
}
bootstrap();
