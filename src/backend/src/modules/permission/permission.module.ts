import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { PermissionService } from './permission.service';

@Module({
    imports: [TypeOrmModule.forFeature([Role])],
    providers: [PermissionService],
    exports: [PermissionService],
})
export class PermissionModule { }
