import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../db/prisma/prisma.service';

@Injectable()
export class TodosService {
  constructor(private prisma: PrismaService) {}

  async createTodo(userId: number, title: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User with this email not found');
    }
    return this.prisma.todo.create({
      data: { title, userId },
    });
  }

  async listTodos(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User with this email not found');
    }
    return this.prisma.todo.findMany({ where: { userId } });
  }
}
