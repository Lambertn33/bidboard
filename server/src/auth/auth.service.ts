import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcryptjs';
import { Role } from 'generated/prisma/client';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService,
        private readonly databaseService: DatabaseService
    ) {}

    async validateUser(email: string, password: string) {
        const user = await this.databaseService.user.findFirst({
          where: {
            email,
          },
        });
    
        if (user && (await bcrypt.compare(password, user.password))) {
          const { password, ...result } = user;
          return result;
        }
        return null;
    }

    async checkUserExistence(email: string) {
        const user = await this.databaseService.user.findFirst({
          where: { email },
        });
    
        return !!user;
    }

    async login(email: string, password: string) {
        const user = await this.validateUser(email, password);
        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }
        return {
            access_token: this.jwtService.sign({ id: user.id, email: user.email, role: user.role }),
        }
    }

    async register (names: string, email: string, password: string) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        try {
            const user = await this.databaseService.user.create({
                data: {
                    names,
                    email,
                    password: hashedPassword,
                    role: Role.FREELANCER,
                },  
            });
    
            const {access_token} = await this.login(email, password);
            return {
                message: 'User registered successfully',
                data: {
                    user,
                    access_token
                },
            };
        } catch (error) {
            throw new BadRequestException('Failed to register user', error);
        }
    }
}
