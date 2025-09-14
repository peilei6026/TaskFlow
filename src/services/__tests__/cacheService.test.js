import { describe, it, expect, beforeEach, vi } from 'vitest';
import cacheService from '../cacheService';

describe('CacheService', () => {
  beforeEach(() => {
    cacheService.clear();
    vi.clearAllTimers();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('set and get', () => {
    it('should store and retrieve data correctly', () => {
      const key = 'test-key';
      const value = { data: 'test-data' };
      const ttl = 1000; // 1 second

      cacheService.set(key, value, ttl);
      const retrieved = cacheService.get(key);

      expect(retrieved).toEqual(value);
    });

    it('should return null for non-existent key', () => {
      const retrieved = cacheService.get('non-existent');
      expect(retrieved).toBeNull();
    });

    it('should return null for expired data', () => {
      const key = 'test-key';
      const value = { data: 'test-data' };
      const ttl = 1000; // 1 second

      cacheService.set(key, value, ttl);
      
      // Fast forward time beyond TTL
      vi.advanceTimersByTime(1001);
      
      const retrieved = cacheService.get(key);
      expect(retrieved).toBeNull();
    });

    it('should use default TTL when not provided', () => {
      const key = 'test-key';
      const value = { data: 'test-data' };

      cacheService.set(key, value);
      
      // Should still be valid within default TTL (5 minutes)
      const retrieved = cacheService.get(key);
      expect(retrieved).toEqual(value);
    });
  });

  describe('delete', () => {
    it('should delete existing key', () => {
      const key = 'test-key';
      const value = { data: 'test-data' };

      cacheService.set(key, value);
      expect(cacheService.get(key)).toEqual(value);

      cacheService.delete(key);
      expect(cacheService.get(key)).toBeNull();
    });

    it('should handle deleting non-existent key gracefully', () => {
      expect(() => {
        cacheService.delete('non-existent');
      }).not.toThrow();
    });
  });

  describe('clear', () => {
    it('should clear all cached data', () => {
      cacheService.set('key1', 'value1');
      cacheService.set('key2', 'value2');
      
      expect(cacheService.get('key1')).toBe('value1');
      expect(cacheService.get('key2')).toBe('value2');

      cacheService.clear();
      
      expect(cacheService.get('key1')).toBeNull();
      expect(cacheService.get('key2')).toBeNull();
    });
  });

  describe('cleanup', () => {
    it('should remove expired entries', () => {
      const key1 = 'key1';
      const key2 = 'key2';
      const value = { data: 'test' };
      const shortTtl = 1000; // 1 second
      const longTtl = 10000; // 10 seconds

      cacheService.set(key1, value, shortTtl);
      cacheService.set(key2, value, longTtl);

      // Fast forward to expire key1 but not key2
      vi.advanceTimersByTime(1001);

      cacheService.cleanup();

      expect(cacheService.get(key1)).toBeNull();
      expect(cacheService.get(key2)).toEqual(value);
    });
  });

  describe('getStats', () => {
    it('should return correct statistics', () => {
      cacheService.set('key1', 'value1');
      cacheService.set('key2', 'value2');

      const stats = cacheService.getStats();

      expect(stats.size).toBe(2);
      expect(stats.keys).toContain('key1');
      expect(stats.keys).toContain('key2');
    });

    it('should return empty stats when cache is empty', () => {
      const stats = cacheService.getStats();

      expect(stats.size).toBe(0);
      expect(stats.keys).toEqual([]);
    });
  });

  describe('edge cases', () => {
    it('should handle null and undefined values', () => {
      cacheService.set('null-key', null);
      cacheService.set('undefined-key', undefined);

      expect(cacheService.get('null-key')).toBeNull();
      expect(cacheService.get('undefined-key')).toBeUndefined();
    });

    it('should handle complex objects', () => {
      const complexObject = {
        nested: {
          array: [1, 2, 3],
          function: () => 'test',
        },
        date: new Date('2024-01-01'),
      };

      cacheService.set('complex', complexObject);
      const retrieved = cacheService.get('complex');

      expect(retrieved).toEqual(complexObject);
      expect(retrieved.nested.array).toEqual([1, 2, 3]);
    });

    it('should handle very long keys', () => {
      const longKey = 'a'.repeat(1000);
      const value = 'test';

      cacheService.set(longKey, value);
      const retrieved = cacheService.get(longKey);

      expect(retrieved).toBe(value);
    });
  });
});
