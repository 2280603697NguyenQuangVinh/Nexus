import { Module } from '@nestjs/common';
import { WebSocketGatewayClass } from './websocket.gateway';
import { PresenceModule } from '@modules/presence/presence.module';
import { AuthModule } from '@modules/auth/auth.module';

@Module({
    imports: [PresenceModule, AuthModule],
    providers: [WebSocketGatewayClass],
})
export class WebSocketGatewayModule { }
