import { describe, it, expect } from 'vitest';

// 测试工具函数
const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('zh-CN');
};

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const formatTaskStatus = (status) => {
  const statusMap = {
      'TODO': '待开始',
          'IN_PROGRESS': '进行中',
          'COMPLETED': '已完成',
          'todo': '待开始',
          'in_progress': '进行中',
          'completed': '已完成'
  };
  return statusMap[status] || status;
};

describe('Utility Functions', () => {
  describe('formatDate', () => {
    it('should format valid date', () => {
      const date = '2024-01-01';
      const result = formatDate(date);
      expect(result).toMatch(/\d{4}\/\d{1,2}\/\d{1,2}/);
    });

    it('should return empty string for invalid date', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
      expect(formatDate('')).toBe('');
    });
  });

  describe('validateEmail', () => {
    it('should validate correct email addresses', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('admin@company.org')).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('invalid-email')).toBe(false);
      expect(validateEmail('@domain.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('formatTaskStatus', () => {
    it('should format task status correctly', () => {
      expect(formatTaskStatus('TODO')).toBe('待办');
      expect(formatTaskStatus('IN_PROGRESS')).toBe('进行中');
      expect(formatTaskStatus('COMPLETED')).toBe('已完成');
      expect(formatTaskStatus('CANCELLED')).toBe('已取消');
    });

    it('should return original status for unknown values', () => {
      expect(formatTaskStatus('UNKNOWN')).toBe('UNKNOWN');
      expect(formatTaskStatus('')).toBe('');
    });
  });
});
