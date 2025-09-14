# 任务管理系统 Docker 配置
# 基于 Nginx 的轻量级部署

FROM nginx:alpine

# 维护者信息
LABEL maintainer="任务管理系统开发团队"
LABEL description="现代化轻量级任务管理系统"
LABEL version="1.0.0"

# 设置工作目录
WORKDIR /usr/share/nginx/html

# 复制应用文件
COPY index.html .
COPY src/ ./src/
COPY dist/ ./dist/
COPY *.md ./

# 复制自定义 Nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost/ || exit 1

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]