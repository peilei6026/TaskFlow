import React from 'react';
import { Result, Button } from 'antd';
import { BugOutlined, ReloadOutlined } from '@ant-design/icons';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // 记录错误信息
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // 这里可以将错误信息发送到错误监控服务
    // 例如: Sentry.captureException(error);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      // 自定义降级 UI
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f5f5'
        }}>
          <Result
            status="500"
            title="页面出现错误"
            subTitle="抱歉，页面遇到了一些问题。请尝试刷新页面或联系管理员。"
            icon={<BugOutlined />}
            extra={
              <div>
                <Button
                  type="primary"
                  onClick={this.handleReload}
                  style={{ marginRight: 8 }}
                >
                  <ReloadOutlined />
                  刷新页面
                </Button>
                <Button onClick={this.handleReset}>
                  重试
                </Button>
              </div>
            }
          >
            {process.env.NODE_ENV === 'development' && (
              <div style={{
                marginTop: 20,
                padding: 16,
                background: '#f6f6f6',
                border: '1px solid #d9d9d9',
                borderRadius: 6,
                textAlign: 'left',
                fontSize: 12,
                fontFamily: 'monospace'
              }}>
                <h4>错误详情 (仅开发环境显示):</h4>
                <p><strong>错误:</strong> {this.state.error && this.state.error.toString()}</p>
                {this.state.errorInfo && (
                  <details style={{ whiteSpace: 'pre-wrap' }}>
                    <summary>错误堆栈</summary>
                    {this.state.errorInfo.componentStack}
                  </details>
                )}
              </div>
            )}
          </Result>
        </div>
      );
    }

    // 没有错误，正常渲染子组件
    return this.props.children;
  }
}

export default ErrorBoundary;