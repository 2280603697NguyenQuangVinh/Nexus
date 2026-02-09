import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { GuildService } from './guild.service';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';

@ApiTags('guilds')
@Controller('guilds')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class GuildController {
    constructor(private readonly guildService: GuildService) { }

    @Post()
    create(@Body() body: { name: string }, @Request() req) {
        return this.guildService.create(body.name, req.user.userId);
    }

    @Get()
    findAll() {
        return this.guildService.findAll();
    }

    @Get('my')
    findMyGuilds(@Request() req) {
        return this.guildService.findByUser(req.user.userId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.guildService.findOne(id);
    }
}
