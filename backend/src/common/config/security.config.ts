import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';

export class SecurityConfig {
  constructor(private configService: ConfigService) {}

  /**
   * 生成安全的JWT密钥
   */
  generateJwtSecret(): string {
    return crypto.randomBytes(64).toString('hex');
  }

  /**
   * 生成安全的随机字符串
   */
  generateRandomString(length: number = 32): string {
    return crypto.randomBytes(length).toString('hex');
  }

  /**
   * 验证JWT密钥强度
   */
  validateJwtSecret(secret: string): boolean {
    if (!secret || secret.length < 32) {
      return false;
    }
    
    // 检查是否包含默认值
    const defaultSecrets = [
      'your-super-secret-jwt-key-change-in-production',
      'secret',
      'jwt-secret',
      'default-secret',
    ];
    
    return !defaultSecrets.includes(secret.toLowerCase());
  }

  /**
   * 获取安全配置
   */
  getSecurityConfig() {
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    
    if (!this.validateJwtSecret(jwtSecret)) {
      throw new Error('JWT密钥不安全，请设置强密钥');
    }

    return {
      jwtSecret,
      jwtExpiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '15m',
      refreshTokenExpiresIn: this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') || '7d',
      bcryptRounds: parseInt(this.configService.get<string>('BCRYPT_ROUNDS') || '12'),
      corsOrigin: this.configService.get<string>('CORS_ORIGIN') || 'http://localhost:3000',
    };
  }

  /**
   * 生成密码哈希
   */
  async hashPassword(password: string, rounds: number = 12): Promise<string> {
    const bcrypt = await import('bcrypt');
    return bcrypt.hash(password, rounds);
  }

  /**
   * 验证密码
   */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    const bcrypt = await import('bcrypt');
    return bcrypt.compare(password, hash);
  }

  /**
   * 生成API密钥
   */
  generateApiKey(): string {
    return `api_${crypto.randomBytes(32).toString('hex')}`;
  }

  /**
   * 验证密码强度
   */
  validatePasswordStrength(password: string): { valid: boolean; message: string } {
    if (password.length < 8) {
      return { valid: false, message: '密码长度至少8位' };
    }

    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: '密码必须包含大写字母' };
    }

    if (!/[a-z]/.test(password)) {
      return { valid: false, message: '密码必须包含小写字母' };
    }

    if (!/[0-9]/.test(password)) {
      return { valid: false, message: '密码必须包含数字' };
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return { valid: false, message: '密码必须包含特殊字符' };
    }

    return { valid: true, message: '密码强度符合要求' };
  }
}
