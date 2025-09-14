import {
  IsOptional,
  IsEnum,
  IsInt,
  IsDateString,
  IsString,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { TaskPriority, TaskStatus } from '../../types/enums';
import { Type } from 'class-transformer';

export class QueryTasksDto {
  @ApiPropertyOptional({
    example: 1,
    description: '页码',
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '页码必须是整数' })
  @Min(1, { message: '页码必须大于0' })
  page?: number = 1;

  @ApiPropertyOptional({
    example: 20,
    description: '每页数量',
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '每页数量必须是整数' })
  @Min(1, { message: '每页数量必须大于0' })
  limit?: number = 20;

  @ApiPropertyOptional({
    enum: TaskStatus,
    example: TaskStatus.TODO,
    description: '任务状态筛选',
  })
  @IsOptional()
  @IsEnum(TaskStatus, { message: '任务状态无效' })
  status?: TaskStatus;

  @ApiPropertyOptional({
    enum: TaskPriority,
    example: TaskPriority.HIGH,
    description: '任务优先级筛选',
  })
  @IsOptional()
  @IsEnum(TaskPriority, { message: '任务优先级无效' })
  priority?: TaskPriority;

  @ApiPropertyOptional({
    example: 2,
    description: '分配给的用户ID筛选',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '分配给的用户ID必须是整数' })
  assigneeId?: number;

  @ApiPropertyOptional({
    example: 1,
    description: '创建者用户ID筛选',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '创建者用户ID必须是整数' })
  creatorId?: number;

  @ApiPropertyOptional({
    example: '2024-01-01',
    description: '截止日期开始范围',
  })
  @IsOptional()
  @IsDateString({}, { message: '截止日期开始范围格式无效' })
  dueDateFrom?: string;

  @ApiPropertyOptional({
    example: '2024-12-31',
    description: '截止日期结束范围',
  })
  @IsOptional()
  @IsDateString({}, { message: '截止日期结束范围格式无效' })
  dueDateTo?: string;

  @ApiPropertyOptional({
    example: '开发',
    description: '搜索关键词（标题和描述）',
  })
  @IsOptional()
  @IsString({ message: '搜索关键词必须是字符串' })
  search?: string;

  @ApiPropertyOptional({
    example: 'frontend',
    description: '标签筛选',
  })
  @IsOptional()
  @IsString({ message: '标签必须是字符串' })
  tag?: string;

  @ApiPropertyOptional({
    example: 'createdAt',
    description: '排序字段',
    default: 'createdAt',
  })
  @IsOptional()
  @IsString({ message: '排序字段必须是字符串' })
  sortBy?: string = 'createdAt';

  @ApiPropertyOptional({
    example: 'desc',
    description: '排序方向',
    default: 'desc',
  })
  @IsOptional()
  @IsString({ message: '排序方向必须是字符串' })
  sortOrder?: 'asc' | 'desc' = 'desc';
}