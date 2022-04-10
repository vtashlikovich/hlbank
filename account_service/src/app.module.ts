import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { SwaggerModule } from '@nestjs/swagger';
import { AccountModule } from './account/account.module';

@Module({
    imports: [
        SwaggerModule,
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        DatabaseModule,
        AccountModule],
    providers: [AppService],
})
export class AppModule {}
