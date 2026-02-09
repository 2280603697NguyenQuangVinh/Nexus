import { Controller, Get, Post, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MessageService } from './message.service';
import { JwtAuthGuard } from '@shared/guards/jwt-auth.guard';

@ApiTags('messages')
@Controller('messages')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class MessageController {
    constructor(private readonly messageService: MessageService) { }

    @Post()
    create(
        @Body() body: { content: string; channelId: string; guildId: string; attachments?: string[] },
        @Request() req,
    ) {
        return this.messageService.create(
            body.content,
            req.user.userId,
            body.channelId,
            body.guildId,
            body.attachments,
        );
    }

    @Get('channel/:channelId')
    findByChannel(@Param('channelId') channelId: string, @Query('limit') limit?: number) {
        return this.messageService.findByChannel(channelId, limit);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.messageService.findOne(id);
    }
}
