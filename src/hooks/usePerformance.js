import { useEffect, useRef } from 'react';

/**
 * 性能监控Hook
 */
export const usePerformance = (componentName) => {
  const startTime = useRef(performance.now());
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    const endTime = performance.now();
    const renderTime = endTime - startTime.current;

    // 只在开发环境记录性能数据
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Performance] ${componentName}:`, {
        renderCount: renderCount.current,
        renderTime: `${renderTime.toFixed(2)}ms`,
        timestamp: new Date().toISOString(),
      });
    }

    // 如果渲染时间过长，发出警告
    if (renderTime > 100) {
      console.warn(`[Performance Warning] ${componentName} took ${renderTime.toFixed(2)}ms to render`);
    }

    startTime.current = performance.now();
  });

  return {
    renderCount: renderCount.current,
  };
};

/**
 * 内存使用监控Hook
 */
export const useMemoryMonitor = () => {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
      const checkMemory = () => {
        const memory = performance.memory;
        const used = memory.usedJSHeapSize / 1024 / 1024; // MB
        const total = memory.totalJSHeapSize / 1024 / 1024; // MB
        const limit = memory.jsHeapSizeLimit / 1024 / 1024; // MB

        if (used > limit * 0.8) {
          console.warn('[Memory Warning] High memory usage:', {
            used: `${used.toFixed(2)}MB`,
            total: `${total.toFixed(2)}MB`,
            limit: `${limit.toFixed(2)}MB`,
            usage: `${((used / limit) * 100).toFixed(1)}%`,
          });
        }
      };

      const interval = setInterval(checkMemory, 30000); // 每30秒检查一次
      return () => clearInterval(interval);
    }
  }, []);
};

/**
 * 网络状态监控Hook
 */
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState('unknown');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // 检查连接类型
    if ('connection' in navigator) {
      const connection = navigator.connection;
      setConnectionType(connection.effectiveType || 'unknown');
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, connectionType };
};
