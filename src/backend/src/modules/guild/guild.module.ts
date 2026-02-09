import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Guild, GuildMember } from './guild.entity';
import { GuildService } from './guild.service';
import { GuildController } from './guild.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Guild, GuildMember])],
    controllers: [GuildController],
    providers: [GuildService],
    exports: [GuildService],
})
export class GuildModule { }
