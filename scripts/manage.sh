#!/bin/bash

# 任务管理系统管理脚本
# 提供开发和运维常用命令

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# 显示帮助信息
show_help() {
    echo "任务管理系统管理工具"
    echo ""
    echo "使用方法: $0 <command> [options]"
    echo ""
    echo "可用命令:"
    echo "  start         启动服务"
    echo "  stop          停止服务"
    echo "  restart       重启服务"
    echo "  status        查看服务状态"
    echo "  logs          查看服务日志"
    echo "  build         构建镜像"
    echo "  clean         清理镜像和容器"
    echo "  backup        备份数据"
    echo "  dev           启动开发模式"
    echo "  test          运行测试"
    echo "  health        健康检查"
    echo ""
    echo "示例:"
    echo "  $0 start"
    echo "  $0 logs -f"
    echo "  $0 clean --all"
}

# 启动服务
start_service() {
    log_info "启动任务管理系统..."
    docker-compose up -d
    log_success "服务启动完成"
    log_info "访问地址: http://localhost:3001"
}

# 停止服务
stop_service() {
    log_info "停止任务管理系统..."
    docker-compose down
    log_success "服务已停止"
}

# 重启服务
restart_service() {
    log_info "重启任务管理系统..."
    docker-compose restart
    log_success "服务重启完成"
}

# 查看服务状态
show_status() {
    log_info "服务状态:"
    docker-compose ps
    echo ""
    log_info "Docker 镜像:"
    docker images | grep task-management || echo "无相关镜像"
}

# 查看日志
show_logs() {
    if [ "$1" = "-f" ] || [ "$1" = "--follow" ]; then
        log_info "实时查看日志 (Ctrl+C 退出):"
        docker-compose logs -f
    else
        log_info "最近日志:"
        docker-compose logs --tail=50
    fi
}

# 构建镜像
build_image() {
    log_info "构建 Docker 镜像..."
    docker build -t task-management-system:latest .
    log_success "镜像构建完成"
}

# 清理资源
clean_resources() {
    if [ "$1" = "--all" ]; then
        log_warning "清理所有相关资源..."
        docker-compose down --rmi all --volumes --remove-orphans 2>/dev/null || true
        docker system prune -f
        log_success "清理完成"
    else
        log_info "清理停止的容器..."
        docker-compose down --remove-orphans
        log_success "清理完成"
    fi
}

# 备份数据
backup_data() {
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_dir="./backups"
    local backup_file="${backup_dir}/task_manager_backup_${timestamp}.tar.gz"

    log_info "创建数据备份..."

    mkdir -p $backup_dir

    # 备份配置文件和数据
    tar -czf $backup_file \
        --exclude=node_modules \
        --exclude=.git \
        --exclude=backups \
        .

    log_success "备份创建完成: $backup_file"
}

# 开发模式
dev_mode() {
    log_info "启动开发模式..."

    # 停止可能运行的生产容器
    docker-compose down 2>/dev/null || true

    # 启动 Vite 开发服务器
    if [ -f "package.json" ]; then
        npm install
        npm run dev &
        DEV_PID=$!

        log_success "开发服务器启动完成"
        log_info "Vite 开发服务器: http://localhost:3000"
        log_info "HTML 版本: http://localhost:8080"
        log_info "按 Ctrl+C 停止开发服务器"

        # 等待用户中断
        trap "kill $DEV_PID 2>/dev/null || true; exit" INT
        wait $DEV_PID
    else
        log_error "package.json 不存在，无法启动开发服务器"
        exit 1
    fi
}

# 运行测试
run_tests() {
    log_info "运行功能测试..."

    # 检查应用是否运行
    if ! curl -f http://localhost:3001/health &>/dev/null; then
        log_warning "应用未运行，启动测试环境..."
        start_service
        sleep 5
    fi

    # 基本功能测试
    log_info "测试主页面访问..."
    if curl -f http://localhost:3001 &>/dev/null; then
        log_success "主页面访问正常"
    else
        log_error "主页面访问失败"
        return 1
    fi

    log_info "测试健康检查端点..."
    if curl -f http://localhost:3001/health &>/dev/null; then
        log_success "健康检查正常"
    else
        log_error "健康检查失败"
        return 1
    fi

    log_success "所有测试通过"
}

# 健康检查
health_check() {
    log_info "执行健康检查..."

    # 检查 Docker 服务
    if ! docker info &>/dev/null; then
        log_error "Docker 服务未运行"
        return 1
    fi

    # 检查容器状态
    if docker-compose ps | grep -q "Up"; then
        log_success "容器运行正常"
    else
        log_warning "容器未运行"
    fi

    # 检查端口占用
    if lsof -i :3001 &>/dev/null; then
        log_success "端口 3001 正在使用"
    else
        log_warning "端口 3001 未被占用"
    fi

    # 检查应用响应
    if curl -f http://localhost:3001/health &>/dev/null; then
        log_success "应用响应正常"
    else
        log_warning "应用无响应"
    fi

    log_info "健康检查完成"
}

# 主函数
main() {
    case $1 in
        start)
            start_service
            ;;
        stop)
            stop_service
            ;;
        restart)
            restart_service
            ;;
        status)
            show_status
            ;;
        logs)
            show_logs $2
            ;;
        build)
            build_image
            ;;
        clean)
            clean_resources $2
            ;;
        backup)
            backup_data
            ;;
        dev)
            dev_mode
            ;;
        test)
            run_tests
            ;;
        health)
            health_check
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            if [ -z "$1" ]; then
                log_error "缺少命令参数"
            else
                log_error "未知命令: $1"
            fi
            echo ""
            show_help
            exit 1
            ;;
    esac
}

# 脚本入口
main "$@"