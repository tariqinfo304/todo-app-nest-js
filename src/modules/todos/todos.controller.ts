import { Controller, Get, Post, Body, Req,UseGuards,UsePipes  } from '@nestjs/common';
import { TodosService } from './todos.service';
import { JwtAuthGuard } from '../../shared/jwt-auth.guard';
import { ValidationPipe } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';

@Controller('todos')
@UsePipes(ValidationPipe)  
@UseGuards(JwtAuthGuard)
export class TodosController {
  constructor(private todosService: TodosService) {}
  @Post()
  async create(@Body() createTodoDto: CreateTodoDto, @Req() req) {
    return this.todosService.createTodo(req.user.userId, createTodoDto.title);
  }

  @Get()
  async list(@Req() req) {
    return this.todosService.listTodos(req.user.userId);
  }
}
