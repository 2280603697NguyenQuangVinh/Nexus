import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        const user = await this.userService.create({
            username: registerDto.username,
            email: registerDto.email,
            password: hashedPassword,
        });

        const { password, ...result } = user;
        return {
            user: result,
            access_token: this.generateAccessToken(user),
            refresh_token: this.generateRefreshToken(user),
        };
    }

    async login(loginDto: LoginDto) {
        const user = await this.userService.findByEmail(loginDto.email);

        if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const { password, ...result } = user;
        return {
            user: result,
            access_token: this.generateAccessToken(user),
            refresh_token: this.generateRefreshToken(user),
        };
    }

    private generateAccessToken(user: any): string {
        const payload = { sub: user.id, username: user.username, email: user.email };
        return this.jwtService.sign(payload);
    }

    private generateRefreshToken(user: any): string {
        const payload = { sub: user.id, username: user.username };
        return this.jwtService.sign(payload, { expiresIn: '7d' });
    }
}
