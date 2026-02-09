import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Guild, GuildMember } from './guild.entity';

@Injectable()
export class GuildService {
    constructor(
        @InjectRepository(Guild)
        private guildRepository: Repository<Guild>,
        @InjectRepository(GuildMember)
        private guildMemberRepository: Repository<GuildMember>,
    ) { }

    async create(name: string, ownerId: string): Promise<Guild> {
        const guild = this.guildRepository.create({ name, ownerId });
        const savedGuild = await this.guildRepository.save(guild);

        // Add owner as member
        await this.addMember(savedGuild.id, ownerId, 'owner');

        return savedGuild;
    }

    async findAll(): Promise<Guild[]> {
        return this.guildRepository.find();
    }

    async findOne(id: string): Promise<Guild> {
        return this.guildRepository.findOne({ where: { id } });
    }

    async findByUser(userId: string): Promise<Guild[]> {
        const memberships = await this.guildMemberRepository.find({
            where: { userId },
            relations: ['guild'],
        });
        return memberships.map(m => m.guild);
    }

    async addMember(guildId: string, userId: string, role: string = 'member'): Promise<GuildMember> {
        const member = this.guildMemberRepository.create({ guildId, userId, role });
        return this.guildMemberRepository.save(member);
    }

    async removeMember(guildId: string, userId: string): Promise<void> {
        await this.guildMemberRepository.delete({ guildId, userId });
    }
}
