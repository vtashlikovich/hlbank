import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { App6QModule } from './app6q.module';

async function bootstrap() {
    let app = null;
    
    // special mode, when 6 queues used for messages intercommunication
    if (process.env.REST_USES_6_QUEUES == 'true')
        app = await NestFactory.create(App6QModule);
    else
        app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    app.useGlobalPipes(new ValidationPipe());

    const RESTServiceOn = configService.get('REST_SERVER') == 'true';
    const MQListenerServiceOn = configService.get('MQ_CONSUMER') == 'true';

    console.log(`REST_SERVER = ${configService.get('REST_SERVER')}`);
    console.log(`MQ_CONSUMER = ${configService.get('MQ_CONSUMER')}`);
    console.log(`REST_PRODUCES_MSG = ${configService.get('REST_PRODUCES_MSG')}`);

    // swagger
    if (RESTServiceOn) {
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
                urls: [configService.get('RABBIT_URL')],
                queue: configService.get('RABBIT_QUEUE'),
                noAck: false,
                queueOptions: { durable: true },
                prefetchCount: 1,
            },
        });
        
        await app.startAllMicroservices();
    }

    if (RESTServiceOn) {
        console.log('starting HTTP server');
        const port = process.env.PORT?+process.env.PORT:3000;
        console.log('starting HTTP server on port', port);
        await app.listen(port);
    }
}
bootstrap();
