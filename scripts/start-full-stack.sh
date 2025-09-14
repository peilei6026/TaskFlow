#!/bin/bash

# 全栈启动脚本
echo "🚀 启动全栈任务管理系统..."

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到Node.js，请先安装Node.js"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到npm，请先安装npm"
    exit 1
fi

echo "📦 检查并安装前端依赖..."
if [ ! -d "node_modules" ]; then
    npm install
fi

echo "📦 检查并安装后端依赖..."
cd backend
if [ ! -d "node_modules" ]; then
    npm install
fi

echo "🔧 初始化数据库（如果需要）..."
if [ ! -f "prisma/dev.db" ]; then
    npm run db:generate
    npm run db:migrate
    npm run db:seed
fi

echo "🎯 启动后端服务 (端口: 3002)..."
npm run start:dev &
BACKEND_PID=$!

# 等待后端服务启动
sleep 5

cd ..

echo "🌐 启动前端服务 (端口: 3000)..."
npm run dev &
FRONTEND_PID=$!

echo "✅ 全栈服务启动完成!"
echo ""
echo "📍 服务地址:"
echo "   前端: http://localhost:3000"
echo "   后端: http://localhost:3002"
echo "   API文档: http://localhost:3002/api/docs (如果已配置)"
echo ""
echo "🛑 按Ctrl+C停止所有服务"

# 监听中断信号，优雅关闭服务
trap 'echo "🛑 正在停止服务..."; kill $BACKEND_PID $FRONTEND_PID; exit 0' SIGINT SIGTERM

# 等待用户输入
wait