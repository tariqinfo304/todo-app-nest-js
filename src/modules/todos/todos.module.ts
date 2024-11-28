import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TodosController } from './todos.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '../../shared/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [TodosService, JwtAuthGuard],
  controllers: [TodosController],
})
export class TodosModule {}
