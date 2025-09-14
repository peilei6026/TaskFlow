import { plainToClass, Transform } from 'class-transformer';
import { IsString, IsNumber, IsOptional, IsBoolean, validateSync, Min, Max } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  NODE_ENV: string = 'development';

  @IsNumber()
  @Min(1)
  @Max(65535)
  @Transform(({ value }) => parseInt(value, 10))
  PORT: number = 3002;

  @IsString()
  DATABASE_URL: string;

  @IsString()
  JWT_SECRET: string;

  @IsOptional()
  @IsString()
  JWT_EXPIRES_IN?: string = '15m';

  @IsOptional()
  @IsString()
  REFRESH_TOKEN_EXPIRES_IN?: string = '7d';

  @IsOptional()
  @IsNumber()
  @Min(8)
  @Max(15)
  @Transform(({ value }) => parseInt(value, 10))
  BCRYPT_ROUNDS?: number = 12;

  @IsOptional()
  @IsString()
  CORS_ORIGIN?: string = 'http://localhost:3000';

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  ENABLE_SWAGGER?: boolean = true;

  @IsOptional()
  @IsString()
  REDIS_URL?: string;

  @IsOptional()
  @IsString()
  LOG_LEVEL?: string = 'info';

  @IsOptional()
  @IsString()
  SENTRY_DSN?: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMessages = errors.map(error => 
      Object.values(error.constraints || {}).join(', ')
    ).join('; ');
    
    throw new Error(`环境配置验证失败: ${errorMessages}`);
  }

  return validatedConfig;
}

export function validateSecurityConfig(config: EnvironmentVariables) {
  const securityIssues: string[] = [];

  // 检查JWT密钥
  if (!config.JWT_SECRET || config.JWT_SECRET.length < 32) {
    securityIssues.push('JWT_SECRET 必须至少32个字符');
  }

  if (config.JWT_SECRET === 'your-super-secret-jwt-key-change-in-production') {
    securityIssues.push('JWT_SECRET 不能使用默认值');
  }

  // 检查数据库URL
  if (config.NODE_ENV === 'production' && config.DATABASE_URL?.includes('sqlite')) {
    securityIssues.push('生产环境不能使用SQLite数据库');
  }

  // 检查CORS配置
  if (config.NODE_ENV === 'production' && config.CORS_ORIGIN === '*') {
    securityIssues.push('生产环境CORS不能设置为通配符');
  }

  if (securityIssues.length > 0) {
    throw new Error(`安全配置问题:\n${securityIssues.join('\n')}`);
  }

  return true;
}
