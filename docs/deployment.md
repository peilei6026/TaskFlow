# 部署指南

## 1. 概述

本文档详细介绍了任务管理系统的部署流程，包括开发环境、测试环境和生产环境的部署配置。系统采用前后端分离架构，后端基于 NestJS，前端基于 React + Vite，数据库使用 SQLite。

## 2. 系统架构

### 2.1 部署架构图
```
┌─────────────────────────────────────────────────┐
│                  负载均衡器                      │
│                (Nginx/Apache)                  │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────┼───────────────────────────────┐
│                 │        Web 服务器              │
│    ┌────────────▼─────────────┐                 │
│    │       前端静态文件         │                 │
│    │    (React + Vite)        │                 │
│    └──────────────────────────┘                 │
└─────────────────────────────────────────────────┘
                  │ HTTP API
┌─────────────────┼───────────────────────────────┐
│                 │      应用服务器                │
│    ┌────────────▼─────────────┐                 │
│    │      后端 API 服务        │                 │
│    │      (NestJS)           │                 │
│    └────────────┬─────────────┘                 │
│                 │                               │
│    ┌────────────▼─────────────┐                 │
│    │      SQLite 数据库        │                 │
│    └──────────────────────────┘                 │
└─────────────────────────────────────────────────┘
```

### 2.2 技术栈
- **前端**: React 18 + TypeScript + Vite + Ant Design
- **后端**: NestJS + TypeScript + TypeORM
- **数据库**: SQLite
- **Web服务器**: Nginx
- **进程管理**: PM2
- **容器化**: Docker (可选)

## 3. 环境准备

### 3.1 服务器要求

#### 最低配置
- **CPU**: 1核
- **内存**: 1GB RAM
- **存储**: 10GB 可用空间
- **网络**: 稳定的互联网连接
- **操作系统**: Ubuntu 20.04 LTS / CentOS 8+ / RHEL 8+

#### 推荐配置
- **CPU**: 2核或更多
- **内存**: 2GB RAM 或更多
- **存储**: 20GB 可用空间
- **网络**: 10Mbps 带宽
- **操作系统**: Ubuntu 22.04 LTS

### 3.2 软件依赖
- **Node.js**: v18.x 或更高
- **npm**: v9.x 或更高
- **Nginx**: v1.18 或更高
- **PM2**: v5.x 或更高
- **Git**: v2.x 或更高

## 4. 部署准备

### 4.1 创建部署用户
```bash
# 创建专用部署用户
sudo useradd -m -s /bin/bash deploy
sudo usermod -aG sudo deploy

# 切换到部署用户
sudo su - deploy
```

### 4.2 安装 Node.js
```bash
# 使用 NodeSource 仓库安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 验证安装
node --version
npm --version
```

### 4.3 安装 PM2
```bash
# 全局安装 PM2
sudo npm install -g pm2

# 设置 PM2 开机自启
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u deploy --hp /home/deploy
```

### 4.4 安装 Nginx
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS/RHEL
sudo yum install nginx
# 或者
sudo dnf install nginx

# 启动并设置开机自启
sudo systemctl start nginx
sudo systemctl enable nginx
```

## 5. 应用部署

### 5.1 下载项目代码
```bash
# 克隆项目到服务器
cd /home/deploy
git clone <your-repository-url> taskmanager
cd taskmanager
```

### 5.2 后端部署

#### 5.2.1 安装后端依赖
```bash
cd backend
npm install --production
```

#### 5.2.2 配置环境变量
```bash
# 创建生产环境配置文件
cp .env.example .env.production

# 编辑配置文件
nano .env.production
```

生产环境配置示例：
```env
# 应用配置
NODE_ENV=production
PORT=3000

# 数据库配置
DATABASE_PATH=/home/deploy/taskmanager/data/task_manager.db

# JWT 配置
JWT_SECRET=your-production-jwt-secret-key-change-this
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# 应用配置
APP_NAME="任务管理系统"
APP_VERSION=1.0.0

# CORS 配置
CORS_ORIGIN=https://yourdomain.com

# 日志配置
LOG_LEVEL=info
```

#### 5.2.3 构建应用
```bash
npm run build
```

#### 5.2.4 创建数据目录
```bash
mkdir -p /home/deploy/taskmanager/data
mkdir -p /home/deploy/taskmanager/logs
```

#### 5.2.5 创建 PM2 配置文件
创建 `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'taskmanager-api',
    script: './dist/main.js',
    cwd: '/home/deploy/taskmanager/backend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '../logs/pm2-error.log',
    out_file: '../logs/pm2-out.log',
    log_file: '../logs/pm2-combined.log',
    time: true
  }]
}
```

#### 5.2.6 使用 PM2 启动后端服务
```bash
# 启动应用
pm2 start ecosystem.config.js --env production

# 保存 PM2 配置
pm2 save

# 查看应用状态
pm2 status
pm2 logs taskmanager-api
```

### 5.3 前端部署

#### 5.3.1 安装前端依赖
```bash
cd ../frontend
npm install
```

#### 5.3.2 配置环境变量
创建 `.env.production`:
```env
VITE_API_BASE_URL=https://yourdomain.com/api
VITE_APP_TITLE=任务管理系统
```

#### 5.3.3 构建前端应用
```bash
npm run build
```

#### 5.3.4 部署静态文件
```bash
# 创建 web 目录
sudo mkdir -p /var/www/taskmanager

# 复制构建文件
sudo cp -r dist/* /var/www/taskmanager/

# 设置权限
sudo chown -R www-data:www-data /var/www/taskmanager
sudo chmod -R 755 /var/www/taskmanager
```

## 6. Nginx 配置

### 6.1 创建 Nginx 配置文件
```bash
sudo nano /etc/nginx/sites-available/taskmanager
```

配置内容：
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # 重定向到 HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    # SSL 配置
    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    # SSL 安全配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    # 前端静态文件
    location / {
        root /var/www/taskmanager;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;

        # 缓存配置
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API 代理
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # 超时配置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # 健康检查
    location /health {
        proxy_pass http://localhost:3000/health;
        access_log off;
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    # 日志配置
    access_log /var/log/nginx/taskmanager.access.log;
    error_log /var/log/nginx/taskmanager.error.log;
}
```

### 6.2 启用站点配置
```bash
# 启用站点
sudo ln -s /etc/nginx/sites-available/taskmanager /etc/nginx/sites-enabled/

# 测试 Nginx 配置
sudo nginx -t

# 重新加载 Nginx
sudo systemctl reload nginx
```

## 7. SSL 证书配置

### 7.1 使用 Let's Encrypt (推荐)
```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取 SSL 证书
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 设置自动续期
sudo crontab -e
# 添加以下行：
# 0 12 * * * /usr/bin/certbot renew --quiet
```

### 7.2 使用自签名证书（仅用于测试）
```bash
# 创建证书目录
sudo mkdir -p /etc/nginx/ssl

# 生成自签名证书
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/taskmanager.key \
  -out /etc/nginx/ssl/taskmanager.crt

# 更新 Nginx 配置中的证书路径
ssl_certificate /etc/nginx/ssl/taskmanager.crt;
ssl_certificate_key /etc/nginx/ssl/taskmanager.key;
```

## 8. 数据库初始化

### 8.1 创建初始管理员用户
```bash
cd /home/deploy/taskmanager/backend

# 创建种子脚本
cat > scripts/create-admin.js << 'EOF'
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../data/task_manager.db');
const db = new sqlite3.Database(dbPath);

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('admin123456', 12);

  const sql = `
    INSERT OR IGNORE INTO users (
      username, email, password, role, status, displayName, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `;

  db.run(sql, [
    'admin',
    'admin@example.com',
    hashedPassword,
    'admin',
    'active',
    '系统管理员'
  ], function(err) {
    if (err) {
      console.error('Error creating admin user:', err);
    } else {
      console.log('Admin user created successfully');
      console.log('Username: admin');
      console.log('Email: admin@example.com');
      console.log('Password: admin123456');
      console.log('Please change the password after first login!');
    }
    db.close();
  });
}

createAdmin();
EOF

# 运行种子脚本
node scripts/create-admin.js
```

### 8.2 数据库备份脚本
```bash
# 创建备份脚本
cat > /home/deploy/taskmanager/scripts/backup.sh << 'EOF'
#!/bin/bash

BACKUP_DIR="/home/deploy/taskmanager/backups"
DB_FILE="/home/deploy/taskmanager/data/task_manager.db"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/task_manager_$DATE.db"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 备份数据库
if [ -f "$DB_FILE" ]; then
    cp "$DB_FILE" "$BACKUP_FILE"
    echo "Database backed up to: $BACKUP_FILE"

    # 压缩备份文件
    gzip "$BACKUP_FILE"
    echo "Backup compressed: $BACKUP_FILE.gz"

    # 删除 30 天前的备份
    find $BACKUP_DIR -name "task_manager_*.db.gz" -mtime +30 -delete
    echo "Old backups cleaned up"
else
    echo "Database file not found: $DB_FILE"
    exit 1
fi
EOF

# 设置执行权限
chmod +x /home/deploy/taskmanager/scripts/backup.sh

# 设置定时备份
crontab -e
# 添加以下行（每天凌晨 2 点备份）：
# 0 2 * * * /home/deploy/taskmanager/scripts/backup.sh >> /home/deploy/taskmanager/logs/backup.log 2>&1
```

## 9. 监控和日志

### 9.1 应用监控
```bash
# 查看 PM2 状态
pm2 status
pm2 monit

# 查看应用日志
pm2 logs taskmanager-api

# 查看系统资源使用
htop
df -h
free -m
```

### 9.2 日志轮转配置
```bash
# 创建 logrotate 配置
sudo nano /etc/logrotate.d/taskmanager

# 配置内容：
/home/deploy/taskmanager/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 deploy deploy
    postrotate
        pm2 reload taskmanager-api
    endscript
}

/var/log/nginx/taskmanager.*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 www-data www-data
    postrotate
        systemctl reload nginx
    endscript
}
```

### 9.3 健康检查脚本
```bash
cat > /home/deploy/taskmanager/scripts/health-check.sh << 'EOF'
#!/bin/bash

API_URL="http://localhost:3000/health"
LOG_FILE="/home/deploy/taskmanager/logs/health-check.log"

# 检查 API 健康状态
response=$(curl -s -o /dev/null -w "%{http_code}" $API_URL)

if [ $response -eq 200 ]; then
    echo "$(date): API is healthy" >> $LOG_FILE
else
    echo "$(date): API is unhealthy (HTTP $response)" >> $LOG_FILE
    # 可以在这里添加重启逻辑或发送告警
    pm2 restart taskmanager-api
fi
EOF

chmod +x /home/deploy/taskmanager/scripts/health-check.sh

# 设置定时健康检查
crontab -e
# 添加以下行（每 5 分钟检查一次）：
# */5 * * * * /home/deploy/taskmanager/scripts/health-check.sh
```

## 10. 安全配置

### 10.1 防火墙配置
```bash
# 启用 UFW 防火墙
sudo ufw enable

# 允许 SSH
sudo ufw allow ssh

# 允许 HTTP 和 HTTPS
sudo ufw allow 'Nginx Full'

# 查看防火墙状态
sudo ufw status
```

### 10.2 系统安全加固
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 配置自动安全更新
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# 设置 fail2ban
sudo apt install fail2ban
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 10.3 应用安全配置
```bash
# 设置文件权限
chmod 600 /home/deploy/taskmanager/backend/.env.production
chmod 755 /home/deploy/taskmanager/data
chmod 644 /home/deploy/taskmanager/data/task_manager.db

# 设置目录所有者
chown -R deploy:deploy /home/deploy/taskmanager
```

## 11. Docker 部署（可选）

### 11.1 创建 Dockerfile

后端 Dockerfile：
```dockerfile
# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# 复制依赖文件
COPY package*.json ./
RUN npm ci --only=production

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 创建数据目录
RUN mkdir -p data logs

# 暴露端口
EXPOSE 3000

# 启动应用
CMD ["node", "dist/main.js"]
```

前端 Dockerfile：
```dockerfile
# frontend/Dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 11.2 创建 docker-compose.yml
```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_PATH=/app/data/task_manager.db
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs
    restart: unless-stopped

  frontend:
    build: ./frontend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  data:
  logs:
```

### 11.3 Docker 部署命令
```bash
# 构建和启动服务
docker-compose up -d

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down

# 更新应用
docker-compose pull
docker-compose up -d
```

## 12. 更新和维护

### 12.1 应用更新流程
```bash
#!/bin/bash
# update.sh

set -e

echo "Starting application update..."

# 备份数据库
/home/deploy/taskmanager/scripts/backup.sh

# 停止应用
pm2 stop taskmanager-api

# 拉取最新代码
cd /home/deploy/taskmanager
git pull origin main

# 更新后端
cd backend
npm install --production
npm run build

# 更新前端
cd ../frontend
npm install
npm run build
sudo cp -r dist/* /var/www/taskmanager/

# 重启应用
pm2 start taskmanager-api

echo "Application updated successfully!"
```

### 12.2 回滚流程
```bash
#!/bin/bash
# rollback.sh

BACKUP_VERSION=$1

if [ -z "$BACKUP_VERSION" ]; then
    echo "Usage: $0 <backup_version>"
    exit 1
fi

echo "Rolling back to version: $BACKUP_VERSION"

# 停止应用
pm2 stop taskmanager-api

# 回滚代码
git checkout $BACKUP_VERSION

# 重新构建
cd backend
npm install --production
npm run build

cd ../frontend
npm install
npm run build
sudo cp -r dist/* /var/www/taskmanager/

# 重启应用
pm2 start taskmanager-api

echo "Rollback completed!"
```

## 13. 故障排除

### 13.1 常见问题

#### 问题 1: 应用无法启动
```bash
# 检查日志
pm2 logs taskmanager-api

# 检查端口占用
netstat -tulpn | grep :3000

# 检查环境变量
cat /home/deploy/taskmanager/backend/.env.production
```

#### 问题 2: 数据库连接失败
```bash
# 检查数据库文件权限
ls -la /home/deploy/taskmanager/data/

# 检查数据库文件是否存在
sqlite3 /home/deploy/taskmanager/data/task_manager.db ".tables"
```

#### 问题 3: Nginx 配置错误
```bash
# 测试 Nginx 配置
sudo nginx -t

# 查看 Nginx 错误日志
sudo tail -f /var/log/nginx/error.log
```

### 13.2 性能调优

#### 后端性能优化
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'taskmanager-api',
    script: './dist/main.js',
    instances: 'max', // 使用所有 CPU 核心
    exec_mode: 'cluster',
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
}
```

#### Nginx 性能优化
```nginx
# 在 nginx.conf 中添加
worker_processes auto;
worker_connections 1024;
keepalive_timeout 65;
client_max_body_size 50M;

# 启用缓存
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g inactive=60m use_temp_path=off;

location /api {
    proxy_cache api_cache;
    proxy_cache_valid 200 5m;
    proxy_cache_key $scheme$proxy_host$request_uri;
    # ... 其他配置
}
```

## 14. 总结

本文档提供了任务管理系统的完整部署指南，包括：

1. **环境准备**: 服务器配置和软件依赖安装
2. **应用部署**: 前后端应用的详细部署步骤
3. **Web服务器配置**: Nginx 配置和 SSL 证书设置
4. **数据库管理**: 数据库初始化和备份策略
5. **监控维护**: 日志管理、健康检查和性能监控
6. **安全配置**: 系统安全加固和应用安全设置
7. **Docker部署**: 容器化部署的可选方案
8. **运维流程**: 更新、回滚和故障排除

遵循本指南可以确保系统的稳定运行和高可用性。建议定期检查系统状态，及时更新依赖包，并保持良好的备份习惯。

如有问题，请参考故障排除章节或联系技术支持团队。