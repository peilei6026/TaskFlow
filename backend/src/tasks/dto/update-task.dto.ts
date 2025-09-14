import {
  IsString,
  IsOptional,
  IsEnum,
  IsInt,
  IsDateString,
  IsArray,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '../../types/enums';

export class UpdateTaskDto {
  @ApiPropertyOptional({
    example: '开发新功能（已更新）',
    description: '任务标题',
  })
  @IsOptional()
  @IsString({ message: '任务标题必须是字符串' })
  title?: string;

  @ApiPropertyOptional({
    example: '开发用户管理模块的新功能（详细描述）',
    description: '任务描述',
  })
  @IsOptional()
  @IsString({ message: '任务描述必须是字符串' })
  description?: string;

  @ApiPropertyOptional({
    enum: TaskStatus,
    example: TaskStatus.IN_PROGRESS,
    description: '任务状态',
  })
  @IsOptional()
  @IsEnum(TaskStatus, { message: '任务状态无效' })
  status?: TaskStatus;

  @ApiPropertyOptional({
    enum: TaskPriority,
    example: TaskPriority.HIGH,
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
    example: 3,
    description: '分配给的用户ID',
  })
  @IsOptional()
  @IsInt({ message: '分配给的用户ID必须是整数' })
  assigneeId?: number;

  @ApiPropertyOptional({
    example: ['frontend', 'urgent', 'updated'],
    description: '任务标签',
  })
  @IsOptional()
  @IsArray({ message: '任务标签必须是数组' })
  @IsString({ each: true, message: '每个标签必须是字符串' })
  tags?: string[];

  @ApiPropertyOptional({
    example: 10.5,
    description: '预估工时',
  })
  @IsOptional()
  @IsNumber({}, { message: '预估工时必须是数字' })
  @Min(0, { message: '预估工时不能小于0' })
  estimatedHours?: number;

  @ApiPropertyOptional({
    example: 5.5,
    description: '实际工时',
  })
  @IsOptional()
  @IsNumber({}, { message: '实际工时必须是数字' })
  @Min(0, { message: '实际工时不能小于0' })
  actualHours?: number;

  @ApiPropertyOptional({
    example: 75,
    description: '任务进度（0-100）',
  })
  @IsOptional()
  @IsInt({ message: '任务进度必须是整数' })
  @Min(0, { message: '任务进度不能小于0' })
  @Max(100, { message: '任务进度不能大于100' })
  progress?: number;
}