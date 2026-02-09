import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ChannelService } from './channel.service';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';

@ApiTags('channels')
@Controller('channels')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChannelController {
    constructor(private readonly channelService: ChannelService) { }

    @Post()
    create(@Body() body: { name: string; guildId: string; type?: string }) {
        return this.channelService.create(body.name, body.guildId, body.type);
    }

    @Get('guild/:guildId')
    findByGuild(@Param('guildId') guildId: string) {
        return this.channelService.findByGuild(guildId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.channelService.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.channelService.remove(id);
    }
}
