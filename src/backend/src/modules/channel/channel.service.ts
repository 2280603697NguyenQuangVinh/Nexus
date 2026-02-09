import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Channel } from './channel.entity';

@Injectable()
export class ChannelService {
    constructor(
        @InjectRepository(Channel)
        private channelRepository: Repository<Channel>,
    ) { }

    async create(name: string, guildId: string, type: string = 'text'): Promise<Channel> {
        const channel = this.channelRepository.create({ name, guildId, type });
        return this.channelRepository.save(channel);
    }

    async findByGuild(guildId: string): Promise<Channel[]> {
        return this.channelRepository.find({ where: { guildId } });
    }

    async findOne(id: string): Promise<Channel> {
        return this.channelRepository.findOne({ where: { id } });
    }

    async remove(id: string): Promise<void> {
        await this.channelRepository.delete(id);
    }
}
