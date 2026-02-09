import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.entity';

@Injectable()
export class PermissionService {
    constructor(
        @InjectRepository(Role)
        private roleRepository: Repository<Role>,
    ) { }

    async createRole(name: string, guildId: string, permissions: any): Promise<Role> {
        const role = this.roleRepository.create({ name, guildId, permissions });
        return this.roleRepository.save(role);
    }

    async findByGuild(guildId: string): Promise<Role[]> {
        return this.roleRepository.find({ where: { guildId } });
    }

    async hasPermission(userId: string, guildId: string, permission: string): Promise<boolean> {
        // Simplified permission check - in real app, check user's roles
        return true;
    }
}
