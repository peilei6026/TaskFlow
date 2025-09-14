import { IsString, IsNotEmpty, IsOptional, IsBoolean, IsDateString, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateCalendarEventDto {
  @ApiProperty({ description: '事件标题' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiPropertyOptional({ description: '事件描述' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: '开始时间', example: '2023-12-01T09:00:00Z' })
  @IsDateString()
  startTime: string;

  @ApiProperty({ description: '结束时间', example: '2023-12-01T10:00:00Z' })
  @IsDateString()
  endTime: string;

  @ApiPropertyOptional({ description: '事件类型', enum: ['MEETING', 'DEADLINE', 'REMINDER', 'PERSONAL'], default: 'MEETING' })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({ description: '地点' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ description: '参与者', type: [String] })
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => Array.isArray(value) ? value : [])
  attendees?: string[];

  @ApiPropertyOptional({ description: '是否全天事件', default: false })
  @IsBoolean()
  @IsOptional()
  allDay?: boolean;

  @ApiPropertyOptional({ description: '是否重复事件', default: false })
  @IsBoolean()
  @IsOptional()
  recurring?: boolean;
}