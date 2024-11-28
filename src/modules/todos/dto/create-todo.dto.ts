import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  title: string;
}
