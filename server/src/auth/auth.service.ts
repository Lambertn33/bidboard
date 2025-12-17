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
          include: {
            freelancer: true,
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
        
        const tokenPayload: any = {
            id: user.id,
            email: user.email,
            role: user.role,
            names: user.names,
        };

        // Include freelancer data if user is a freelancer
        if (user.role === Role.FREELANCER && user.freelancer) {
            tokenPayload.telephone = user.freelancer.telephone;
            tokenPayload.balance = user.freelancer.balance;
        }
        return {
            access_token: this.jwtService.sign(tokenPayload),
        }
    }

    async register (names: string, email: string, password: string, telephone: string) {
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

            await this.databaseService.freelancer.create({
                data: {
                    userId: user.id,
                    telephone,
                    balance: 0,
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
