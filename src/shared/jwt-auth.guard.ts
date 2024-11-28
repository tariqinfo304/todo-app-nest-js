import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer')) {
      throw new UnauthorizedException('Authorization token missing or invalid');
    }
    const token = authHeader.split(' ')[1];
    try {
      const secret = this.configService.get<string>('SECRET');
      const decoded = this.jwtService.verify(token, { secret });
      request.user = decoded;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
