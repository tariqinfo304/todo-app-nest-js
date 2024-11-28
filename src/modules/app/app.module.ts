import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { TodosModule } from '../todos/todos.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service'; 

@Module({
  imports: [
    AuthModule,
    TodosModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService], 
})
export class AppModule {}
