import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'newuser',
    description: '用户名',
  })
  @IsString({ message: '用户名必须是字符串' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @Matches(/^[a-zA-Z0-9_]{3,20}$/, {
    message: '用户名只能包含字母、数字和下划线，长度3-20位',
  })
  username: string;

  @ApiProperty({
    example: 'newuser@example.com',
    description: '邮箱地址',
  })
  @IsEmail({}, { message: '请输入有效的邮箱地址' })
  @IsNotEmpty({ message: '邮箱不能为空' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: '密码',
  })
  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码长度至少6位' })
  password: string;

  @ApiPropertyOptional({
    example: '新用户',
    description: '显示名称',
  })
  @IsOptional()
  @IsString({ message: '显示名称必须是字符串' })
  displayName?: string;

  @ApiPropertyOptional({
    example: '张三',
    description: '真实姓名',
  })
  @IsOptional()
  @IsString({ message: '真实姓名必须是字符串' })
  name?: string;

  @ApiPropertyOptional({
    example: '技术部',
    description: '部门',
  })
  @IsOptional()
  @IsString({ message: '部门必须是字符串' })
  department?: string;

  @ApiPropertyOptional({
    example: '开发工程师',
    description: '职位',
  })
  @IsOptional()
  @IsString({ message: '职位必须是字符串' })
  position?: string;

  @ApiPropertyOptional({
    example: '13800138000',
    description: '手机号',
  })
  @IsOptional()
  @IsString({ message: '手机号必须是字符串' })
  @Matches(/^1[3-9]\d{9}$/, { message: '请输入有效的手机号' })
  phone?: string;
}