import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { DatabaseService } from '@/database/database.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly databaseService: DatabaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret',
    });
  }

  async validate(payload: any) {
    const userId = payload.id || payload.sub;
    const user = { id: userId, email: payload.email, role: payload.role };

    // If user is a freelancer, fetch their freelancer record
    if (payload.role === 'FREELANCER') {
      const freelancer = await this.databaseService.freelancer.findUnique({
        where: { userId },
        select: { id: true },
      });
      if (freelancer) {
        return { ...user, freelancer: { id: freelancer.id } };
      }
    }

    return user;
  }
}