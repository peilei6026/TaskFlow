import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsInt,
  IsDateString,
  IsArray,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaskPriority } from '../../types/enums';

export class CreateTaskDto {
  @ApiProperty({
    example: '开发新功能',
    description: '任务标题',
  })
  @IsString({ message: '任务标题必须是字符串' })
  @IsNotEmpty({ message: '任务标题不能为空' })
  title: string;

  @ApiPropertyOptional({
    example: '开发用户管理模块的新功能',
    description: '任务描述',
  })
  @IsOptional()
  @IsString({ message: '任务描述必须是字符串' })
  description?: string;

  @ApiPropertyOptional({
    enum: TaskPriority,
    example: TaskPriority.MEDIUM,
    description: '任务优先级',
  })
  @IsOptional()
  @IsEnum(TaskPriority, { message: '任务优先级无效' })
  priority?: TaskPriority;

  @ApiPropertyOptional({
    example: '2024-12-31T23:59:59.999Z',
    description: '截止日期',
  })
  @IsOptional()
  @IsDateString({}, { message: '截止日期格式无效' })
  dueDate?: string;

  @ApiPropertyOptional({
    example: 2,
    description: '分配给的用户ID',
  })
  @IsOptional()
  @IsInt({ message: '分配给的用户ID必须是整数' })
  assigneeId?: number;

  @ApiPropertyOptional({
    example: ['frontend', 'urgent'],
    description: '任务标签',
  })
  @IsOptional()
  @IsArray({ message: '任务标签必须是数组' })
  @IsString({ each: true, message: '每个标签必须是字符串' })
  tags?: string[];

  @ApiPropertyOptional({
    example: 8.5,
    description: '预估工时',
  })
  @IsOptional()
  @IsNumber({}, { message: '预估工时必须是数字' })
  @Min(0, { message: '预估工时不能小于0' })
  estimatedHours?: number;
}