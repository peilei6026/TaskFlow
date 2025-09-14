#!/bin/bash

# 任务管理系统部署脚本
# 使用方法: ./scripts/deploy.sh [development|production]

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 函数定义
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查 Docker 是否安装
check_docker() {
    if ! command -v docker &> /dev/null; then
        log_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose 未安装，请先安装 Docker Compose"
        exit 1
    fi

    log_success "Docker 环境检查通过"
}

# 构建镜像
build_image() {
    log_info "开始构建 Docker 镜像..."

    # 构建生产版本
    if [ "$1" = "production" ]; then
        log_info "构建生产环境镜像"
        docker build -t task-management-system:latest .
        docker build -t task-management-system:prod .
    else
        log_info "构建开发环境镜像"
        docker build -t task-management-system:dev .
    fi

    log_success "Docker 镜像构建完成"
}

# 启动服务
start_services() {
    log_info "启动容器服务..."

    # 停止现有容器
    docker-compose down 2>/dev/null || true

    # 启动新容器
    docker-compose up -d

    log_success "服务启动完成"
    log_info "应用访问地址: http://localhost:3001"
}

# 检查服务状态
check_health() {
    log_info "检查服务健康状态..."

    # 等待服务启动
    sleep 5

    # 检查容器状态
    if docker-compose ps | grep -q "Up"; then
        log_success "容器运行正常"
    else
        log_error "容器启动失败"
        docker-compose logs
        exit 1
    fi

    # 检查应用响应
    if curl -f http://localhost:3001/health &> /dev/null; then
        log_success "应用健康检查通过"
    else
        log_warning "应用健康检查失败，但容器正在运行"
    fi
}

# 显示使用信息
show_usage() {
    echo "任务管理系统部署脚本"
    echo ""
    echo "使用方法:"
    echo "  $0 [development|production]"
    echo ""
    echo "选项:"
    echo "  development  部署开发环境 (默认)"
    echo "  production   部署生产环境"
    echo ""
    echo "示例:"
    echo "  $0 development"
    echo "  $0 production"
}

# 主函数
main() {
    local environment=${1:-development}

    echo "=================================="
    echo "  任务管理系统 Docker 部署"
    echo "=================================="
    echo ""

    case $environment in
        development|dev)
            log_info "部署模式: 开发环境"
            environment="development"
            ;;
        production|prod)
            log_info "部署模式: 生产环境"
            environment="production"
            ;;
        help|--help|-h)
            show_usage
            exit 0
            ;;
        *)
            log_error "无效的部署模式: $environment"
            show_usage
            exit 1
            ;;
    esac

    # 执行部署步骤
    check_docker
    build_image $environment
    start_services
    check_health

    echo ""
    log_success "部署完成！"
    echo ""
    echo "访问应用:"
    echo "  URL: http://localhost:3001"
    echo "  演示账号: admin / admin123"
    echo ""
    echo "管理命令:"
    echo "  查看日志: docker-compose logs -f"
    echo "  停止服务: docker-compose down"
    echo "  重启服务: docker-compose restart"
}

# 脚本入口
main "$@"