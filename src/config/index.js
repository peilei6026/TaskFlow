// 应用配置
export const config = {
  // API配置
  api: {
    baseURL: '/api',
    timeout: 10000,
  },

  // 开发配置
  development: {
    useMock: false, // 设置为false使用真实后端，true使用Mock数据
  },

  // 后端服务配置
  backend: {
    port: 3002,
    url: 'http://localhost:3002'
  }
};

export default config;