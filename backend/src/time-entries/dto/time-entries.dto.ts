import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString, IsNumber, IsBoolean } from 'class-validator';

export class CreateTimeEntryDto {
  @ApiPropertyOptional({ description: '任务ID' })
  @IsOptional()
  @IsNumber()
  taskId?: number;

  @ApiProperty({ description: '工作时长（小时）' })
  @IsNumber()
  hours: number;

  @ApiProperty({ description: '日期' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({ description: '描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '项目名称' })
  @IsOptional()
  @IsString()
  project?: string;

  @ApiPropertyOptional({ description: '是否可计费' })
  @IsOptional()
  @IsBoolean()
  billable?: boolean;
}

export class UpdateTimeEntryDto {
  @ApiPropertyOptional({ description: '任务ID' })
  @IsOptional()
  @IsNumber()
  taskId?: number;

  @ApiPropertyOptional({ description: '工作时长（小时）' })
  @IsOptional()
  @IsNumber()
  hours?: number;

  @ApiPropertyOptional({ description: '日期' })
  @IsOptional()
  @IsDateString()
  date?: string;

  @ApiPropertyOptional({ description: '描述' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: '项目名称' })
  @IsOptional()
  @IsString()
  project?: string;

  @ApiPropertyOptional({ description: '是否可计费' })
  @IsOptional()
  @IsBoolean()
  billable?: boolean;
}