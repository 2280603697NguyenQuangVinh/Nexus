import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';

// Infrastructure
import { DatabaseModule } from './infrastructure/database/database.module';
import { RedisModule } from './infrastructure/redis/redis.module';

// Domain Modules
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { GuildModule } from './modules/guild/guild.module';
import { ChannelModule } from './modules/channel/channel.module';
import { MessageModule } from './modules/message/message.module';
import { PresenceModule } from './modules/presence/presence.module';
import { PermissionModule } from './modules/permission/permission.module';
import { NotificationModule } from './modules/notification/notification.module';
import { MediaModule } from './modules/media/media.module';

// Gateways
import { WebSocketGatewayModule } from './gateway/realtime-gateway/websocket-gateway.module';

@Module({
    imports: [
        // Configuration
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: '.env',
        }),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: 'localhost',
            port: 5432,
            username: 'postgres',
            password: 'QuangVinh1410',
            database: 'nexus',
            entities: [__dirname + '/**/*.entity.{ts,js}'],
            synchronize: false, // dùng schema đã tạo bằng SQL
          }),
        // Event system (in-memory)
        EventEmitterModule.forRoot(),

        // Infrastructure
        DatabaseModule,
        RedisModule,

        // Domain modules
        UserModule,
        AuthModule,
        GuildModule,
        ChannelModule,
        MessageModule,
        PresenceModule,
        PermissionModule,
        NotificationModule,
        MediaModule,

        // Gateways
        WebSocketGatewayModule,
    ],
})
export class AppModule { }
