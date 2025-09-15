# 技术详细设计文档

## 1. 引言

### 1.1 文档目的
本文档详细描述任务管理系统的技术实现方案，包括系统架构、模块设计、数据库设计、接口设计等技术细节。

### 1.2 适用范围
- 开发团队
- 系统架构师
- 技术负责人

### 1.3 参考文档
- 概要设计说明书
- 系统需求规格说明书

## 2. 系统架构设计

### 2.1 总体架构
```
┌─────────────────────────────────────────────────┐
│                前端层 (Frontend)                  │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────┐  │
│  │    登录页    │  │   任务页面   │  │  用户管理  │  │
│  └─────────────┘  └─────────────┘  └──────────┘  │
└─────────────────────────────────────────────────┘
                        │ HTTP/HTTPS
┌─────────────────────────────────────────────────┐
│              后端API层 (Backend)                  │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────┐  │
│  │  认证模块    │  │   任务模块   │  │  用户模块  │  │
│  └─────────────┘  └─────────────┘  └──────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────┐  │
│  │  权限模块    │  │   时间模块   │  │  公共模块  │  │
│  └─────────────┘  └─────────────┘  └──────────┘  │
└─────────────────────────────────────────────────┘
                        │ TypeORM
┌─────────────────────────────────────────────────┐
│               数据持久层 (Database)               │
│                   SQLite                        │
└─────────────────────────────────────────────────┘
```

### 2.2 技术栈选择

#### 2.2.1 前端技术栈
- **框架**: React 18.x
- **状态管理**: React Hook + Context API
- **路由**: React Router v6
- **UI组件库**: Ant Design 5.x
- **HTTP客户端**: Axios
- **构建工具**: Vite
- **类型检查**: TypeScript 5.x

#### 2.2.2 后端技术栈
- **框架**: NestJS 10.x
- **数据库ORM**: TypeORM 0.3.x
- **数据库**: SQLite 3.x
- **认证**: JWT + Passport
- **密码加密**: bcryptjs
- **API文档**: Swagger/OpenAPI
- **日志**: Winston
- **配置管理**: @nestjs/config

#### 2.2.3 开发工具
- **包管理**: npm
- **代码规范**: ESLint + Prettier
- **提交规范**: Husky + Commitlint
- **API测试**: Postman/Insomnia

## 3. 后端详细设计

### 3.1 项目结构
```
backend/
├── src/
│   ├── main.ts                 # 应用入口
│   ├── app.module.ts           # 根模块
│   ├── config/                 # 配置文件
│   │   ├── database.config.ts
│   │   └── jwt.config.ts
│   ├── common/                 # 公共模块
│   │   ├── decorators/         # 装饰器
│   │   ├── filters/           # 异常过滤器
│   │   ├── guards/            # 守卫
│   │   ├── interceptors/      # 拦截器
│   │   └── dto/               # 通用DTO
│   ├── database/              # 数据库模块
│   │   ├── database.module.ts
│   │   └── migrations/        # 数据库迁移
│   └── modules/               # 业务模块
│       ├── auth/              # 认证模块
│       ├── users/             # 用户模块
│       └── tasks/             # 任务模块
├── test/                      # 测试文件
├── data/                      # SQLite数据库文件
└── package.json
```

### 3.2 核心模块设计

#### 3.2.1 认证模块 (Auth Module)
```typescript
// auth.service.ts
@Injectable()
export class AuthService {
  async login(loginDto: LoginDto): Promise<LoginResponseDto>
  async register(registerDto: RegisterDto): Promise<User>
  async validateUser(email: string, password: string): Promise<User>
  async generateTokens(user: User): Promise<TokensDto>
  async refreshToken(refreshToken: string): Promise<TokensDto>
  async logout(userId: number): Promise<void>
}

// JWT策略
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    return this.userService.findById(payload.sub);
  }
}
```

#### 3.2.2 用户模块 (Users Module)
```typescript
// user.service.ts
@Injectable()
export class UserService {
  async create(createUserDto: CreateUserDto): Promise<User>
  async findAll(query: UserQueryDto): Promise<PaginatedDto<User>>
  async findById(id: number): Promise<User>
  async findByEmail(email: string): Promise<User>
  async update(id: number, updateUserDto: UpdateUserDto): Promise<User>
  async delete(id: number): Promise<void>
  async updateLastLogin(id: number, ip?: string): Promise<void>
  async changePassword(id: number, changePasswordDto: ChangePasswordDto): Promise<void>
}

// user.controller.ts
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  @Get()
  @Roles(UserRole.ADMIN)
  async findAll(@Query() query: UserQueryDto): Promise<PaginatedDto<User>>

  @Get('profile')
  async getProfile(@Request() req): Promise<User>

  @Put('profile')
  async updateProfile(@Request() req, @Body() updateUserDto: UpdateUserDto): Promise<User>

  @Put('password')
  async changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto): Promise<void>
}
```

#### 3.2.3 任务模块 (Tasks Module)
```typescript
// task.service.ts
@Injectable()
export class TaskService {
  async create(createTaskDto: CreateTaskDto, creatorId: number): Promise<Task>
  async findAll(query: TaskQueryDto, userId: number, userRole: UserRole): Promise<PaginatedDto<Task>>
  async findById(id: number, userId: number, userRole: UserRole): Promise<Task>
  async update(id: number, updateTaskDto: UpdateTaskDto, userId: number, userRole: UserRole): Promise<Task>
  async delete(id: number, userId: number, userRole: UserRole): Promise<void>
  async assign(id: number, assigneeId: number, userId: number): Promise<Task>
  async updateStatus(id: number, status: TaskStatus, userId: number): Promise<Task>
  async addComment(id: number, content: string, userId: number): Promise<TaskComment>
  async getComments(taskId: number): Promise<TaskComment[]>
}

// 时间记录服务
@Injectable()
export class TimeEntryService {
  async create(createTimeEntryDto: CreateTimeEntryDto, userId: number): Promise<TimeEntry>
  async findByTask(taskId: number): Promise<TimeEntry[]>
  async findByUser(userId: number, query: TimeEntryQueryDto): Promise<PaginatedDto<TimeEntry>>
  async update(id: number, updateTimeEntryDto: UpdateTimeEntryDto, userId: number): Promise<TimeEntry>
  async delete(id: number, userId: number): Promise<void>
  async getTotalTimeByTask(taskId: number): Promise<number>
  async getTotalTimeByUser(userId: number, startDate?: Date, endDate?: Date): Promise<number>
}
```

### 3.3 数据传输对象 (DTOs)

#### 3.3.1 认证相关DTOs
```typescript
// login.dto.ts
export class LoginDto {
  @ApiProperty({ description: '邮箱地址', example: 'admin@example.com' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @ApiProperty({ description: '密码', example: 'password123' })
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码长度不能少于6位' })
  password: string;
}

// register.dto.ts
export class RegisterDto {
  @ApiProperty({ description: '用户名', example: 'johndoe' })
  @IsNotEmpty({ message: '用户名不能为空' })
  @Length(3, 50, { message: '用户名长度必须在3-50位之间' })
  username: string;

  @ApiProperty({ description: '邮箱地址', example: 'john@example.com' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  email: string;

  @ApiProperty({ description: '密码', example: 'password123' })
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码长度不能少于6位' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/, {
    message: '密码必须包含大小写字母和数字',
  })
  password: string;

  @ApiProperty({ description: '显示名称', example: 'John Doe', required: false })
  @IsOptional()
  displayName?: string;
}
```

#### 3.3.2 任务相关DTOs
```typescript
// create-task.dto.ts
export class CreateTaskDto {
  @ApiProperty({ description: '任务标题', example: '实现用户认证功能' })
  @IsNotEmpty({ message: '任务标题不能为空' })
  @Length(1, 200, { message: '任务标题长度必须在1-200字符之间' })
  title: string;

  @ApiProperty({ description: '任务描述', example: '实现JWT认证和权限控制', required: false })
  @IsOptional()
  @Length(0, 2000, { message: '任务描述长度不能超过2000字符' })
  description?: string;

  @ApiProperty({ description: '任务优先级', enum: TaskPriority, example: TaskPriority.MEDIUM })
  @IsEnum(TaskPriority, { message: '任务优先级不正确' })
  priority: TaskPriority;

  @ApiProperty({ description: '截止日期', example: '2024-12-31T23:59:59.000Z' })
  @IsDateString({}, { message: '截止日期格式不正确' })
  dueDate: string;

  @ApiProperty({ description: '分配给用户ID', example: 1, required: false })
  @IsOptional()
  @IsNumber({}, { message: '分配用户ID必须是数字' })
  assigneeId?: number;

  @ApiProperty({ description: '任务标签', example: ['frontend', 'urgent'], required: false })
  @IsOptional()
  @IsArray({ message: '标签必须是数组' })
  @IsString({ each: true, message: '每个标签必须是字符串' })
  tags?: string[];
}

// task-query.dto.ts
export class TaskQueryDto extends PaginationDto {
  @ApiProperty({ description: '任务状态', enum: TaskStatus, required: false })
  @IsOptional()
  @IsEnum(TaskStatus, { message: '任务状态不正确' })
  status?: TaskStatus;

  @ApiProperty({ description: '任务优先级', enum: TaskPriority, required: false })
  @IsOptional()
  @IsEnum(TaskPriority, { message: '任务优先级不正确' })
  priority?: TaskPriority;

  @ApiProperty({ description: '分配用户ID', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '分配用户ID必须是数字' })
  assigneeId?: number;

  @ApiProperty({ description: '创建用户ID', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '创建用户ID必须是数字' })
  creatorId?: number;

  @ApiProperty({ description: '搜索关键词', required: false })
  @IsOptional()
  @IsString({ message: '搜索关键词必须是字符串' })
  search?: string;

  @ApiProperty({ description: '标签筛选', required: false })
  @IsOptional()
  @IsArray({ message: '标签必须是数组' })
  @IsString({ each: true, message: '每个标签必须是字符串' })
  tags?: string[];

  @ApiProperty({ description: '排序字段', required: false })
  @IsOptional()
  @IsString({ message: '排序字段必须是字符串' })
  sortBy?: string;

  @ApiProperty({ description: '排序方向', enum: ['ASC', 'DESC'], required: false })
  @IsOptional()
  @IsIn(['ASC', 'DESC'], { message: '排序方向必须是ASC或DESC' })
  sortOrder?: 'ASC' | 'DESC';
}
```

### 3.4 数据库设计详细说明

#### 3.4.1 用户表 (users)
| 字段名 | 类型 | 长度 | 是否必填 | 默认值 | 描述 | 索引 |
|--------|------|------|----------|--------|------|------|
| id | INTEGER | - | 是 | AUTO_INCREMENT | 主键 | PRIMARY |
| username | VARCHAR | 50 | 是 | - | 用户名 | UNIQUE |
| email | VARCHAR | 100 | 是 | - | 邮箱地址 | UNIQUE |
| password | VARCHAR | 255 | 是 | - | 加密密码 | - |
| role | VARCHAR | 20 | 是 | 'user' | 用户角色 | INDEX |
| status | VARCHAR | 20 | 是 | 'active' | 用户状态 | INDEX |
| displayName | VARCHAR | 100 | 否 | NULL | 显示名称 | - |
| avatar | VARCHAR | 500 | 否 | NULL | 头像URL | - |
| phone | VARCHAR | 20 | 否 | NULL | 电话号码 | - |
| department | VARCHAR | 100 | 否 | NULL | 部门 | - |
| position | VARCHAR | 100 | 否 | NULL | 职位 | - |
| lastLoginAt | DATETIME | - | 否 | NULL | 最后登录时间 | - |
| lastLoginIp | VARCHAR | 45 | 否 | NULL | 最后登录IP | - |
| createdAt | DATETIME | - | 是 | CURRENT_TIMESTAMP | 创建时间 | INDEX |
| updatedAt | DATETIME | - | 是 | CURRENT_TIMESTAMP | 更新时间 | - |

#### 3.4.2 任务表 (tasks)
| 字段名 | 类型 | 长度 | 是否必填 | 默认值 | 描述 | 索引 |
|--------|------|------|----------|--------|------|------|
| id | INTEGER | - | 是 | AUTO_INCREMENT | 主键 | PRIMARY |
| title | VARCHAR | 200 | 是 | - | 任务标题 | INDEX |
| description | TEXT | - | 否 | NULL | 任务描述 | - |
| status | VARCHAR | 20 | 是 | 'pending' | 任务状态 | INDEX |
| priority | VARCHAR | 20 | 是 | 'medium' | 任务优先级 | INDEX |
| tags | TEXT | - | 否 | NULL | 标签(JSON格式) | - |
| dueDate | DATETIME | - | 否 | NULL | 截止日期 | INDEX |
| completedAt | DATETIME | - | 否 | NULL | 完成时间 | - |
| estimatedHours | DECIMAL | 5,2 | 否 | NULL | 预估工时 | - |
| actualHours | DECIMAL | 5,2 | 否 | 0.00 | 实际工时 | - |
| assigneeId | INTEGER | - | 否 | NULL | 分配用户ID | INDEX |
| creatorId | INTEGER | - | 是 | - | 创建用户ID | INDEX |
| createdAt | DATETIME | - | 是 | CURRENT_TIMESTAMP | 创建时间 | INDEX |
| updatedAt | DATETIME | - | 是 | CURRENT_TIMESTAMP | 更新时间 | - |

#### 3.4.3 时间记录表 (time_entries)
| 字段名 | 类型 | 长度 | 是否必填 | 默认值 | 描述 | 索引 |
|--------|------|------|----------|--------|------|------|
| id | INTEGER | - | 是 | AUTO_INCREMENT | 主键 | PRIMARY |
| description | VARCHAR | 500 | 否 | NULL | 工作描述 | - |
| hours | DECIMAL | 5,2 | 是 | - | 工作时长 | - |
| date | DATE | - | 是 | - | 工作日期 | INDEX |
| taskId | INTEGER | - | 是 | - | 任务ID | INDEX |
| userId | INTEGER | - | 是 | - | 用户ID | INDEX |
| createdAt | DATETIME | - | 是 | CURRENT_TIMESTAMP | 创建时间 | - |
| updatedAt | DATETIME | - | 是 | CURRENT_TIMESTAMP | 更新时间 | - |

#### 3.4.4 任务评论表 (task_comments)
| 字段名 | 类型 | 长度 | 是否必填 | 默认值 | 描述 | 索引 |
|--------|------|------|----------|--------|------|------|
| id | INTEGER | - | 是 | AUTO_INCREMENT | 主键 | PRIMARY |
| content | TEXT | - | 是 | - | 评论内容 | - |
| taskId | INTEGER | - | 是 | - | 任务ID | INDEX |
| userId | INTEGER | - | 是 | - | 用户ID | INDEX |
| createdAt | DATETIME | - | 是 | CURRENT_TIMESTAMP | 创建时间 | INDEX |
| updatedAt | DATETIME | - | 是 | CURRENT_TIMESTAMP | 更新时间 | - |

### 3.5 权限控制设计

#### 3.5.1 基于角色的访问控制 (RBAC)
```typescript
// 用户角色定义
export enum UserRole {
  ADMIN = 'admin',    // 管理员：全部权限
  USER = 'user',      // 普通用户：有限权限
}

// 权限装饰器
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);

// 角色守卫
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.role === role);
  }
}
```

#### 3.5.2 资源权限矩阵
| 操作 | 管理员 | 普通用户 | 说明 |
|------|--------|----------|------|
| 查看所有用户 | ✓ | ✗ | 仅管理员可查看用户列表 |
| 创建用户 | ✓ | ✗ | 仅管理员可创建用户 |
| 更新其他用户 | ✓ | ✗ | 用户只能更新自己的信息 |
| 删除用户 | ✓ | ✗ | 仅管理员可删除用户 |
| 查看所有任务 | ✓ | ✓ | 用户只能查看分配给自己或自己创建的任务 |
| 创建任务 | ✓ | ✓ | 所有用户都可创建任务 |
| 更新任务 | ✓ | 部分 | 用户只能更新分配给自己或自己创建的任务 |
| 删除任务 | ✓ | 部分 | 用户只能删除自己创建的任务 |
| 分配任务 | ✓ | 部分 | 用户只能分配自己创建的任务 |

### 3.6 安全设计

#### 3.6.1 认证安全
- JWT Token有效期：访问令牌15分钟，刷新令牌7天
- 密码强度要求：至少6位，包含大小写字母和数字
- 密码加密：使用bcryptjs进行哈希加密，salt轮数12
- 登录失败保护：连续5次失败后锁定账户30分钟

#### 3.6.2 数据验证
- 所有输入数据使用class-validator进行验证
- SQL注入防护：使用TypeORM参数化查询
- XSS防护：对用户输入进行HTML转义
- CSRF防护：使用CSRF令牌保护状态改变操作

#### 3.6.3 敏感信息保护
- 密码字段在序列化时自动排除
- 数据库连接信息使用环境变量
- JWT密钥使用强随机字符串
- 日志中不记录敏感信息

## 4. 前端详细设计

### 4.1 项目结构
```
frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── components/           # 通用组件
│   │   ├── Layout/          # 布局组件
│   │   ├── TaskCard/        # 任务卡片
│   │   ├── UserAvatar/      # 用户头像
│   │   └── common/          # 基础组件
│   ├── pages/               # 页面组件
│   │   ├── Login/           # 登录页
│   │   ├── Dashboard/       # 仪表盘
│   │   ├── Tasks/           # 任务管理
│   │   ├── Users/           # 用户管理
│   │   └── Profile/         # 个人资料
│   ├── hooks/               # 自定义Hooks
│   │   ├── useAuth.ts       # 认证相关
│   │   ├── useTasks.ts      # 任务相关
│   │   └── useUsers.ts      # 用户相关
│   ├── services/            # API服务
│   │   ├── api.ts           # API基础配置
│   │   ├── auth.ts          # 认证服务
│   │   ├── tasks.ts         # 任务服务
│   │   └── users.ts         # 用户服务
│   ├── store/               # 状态管理
│   │   ├── AuthContext.tsx  # 认证上下文
│   │   └── AppContext.tsx   # 应用上下文
│   ├── utils/               # 工具函数
│   │   ├── constants.ts     # 常量定义
│   │   ├── helpers.ts       # 辅助函数
│   │   └── types.ts         # 类型定义
│   ├── styles/              # 样式文件
│   │   ├── globals.css      # 全局样式
│   │   └── variables.css    # CSS变量
│   ├── App.tsx              # 根组件
│   ├── main.tsx             # 应用入口
│   └── vite-env.d.ts        # Vite类型声明
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### 4.2 核心组件设计

#### 4.2.1 认证相关组件
```typescript
// LoginForm.tsx
interface LoginFormProps {
  onSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [form] = Form.useForm();
  const { login, loading } = useAuth();

  const handleSubmit = async (values: LoginDto) => {
    try {
      await login(values);
      onSuccess();
    } catch (error) {
      message.error('登录失败');
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit} layout="vertical">
      <Form.Item
        name="email"
        label="邮箱"
        rules={[
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '邮箱格式不正确' },
        ]}
      >
        <Input placeholder="请输入邮箱" />
      </Form.Item>

      <Form.Item
        name="password"
        label="密码"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input.Password placeholder="请输入密码" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          登录
        </Button>
      </Form.Item>
    </Form>
  );
};
```

#### 4.2.2 任务管理组件
```typescript
// TaskList.tsx
interface TaskListProps {
  tasks: Task[];
  loading: boolean;
  onEdit: (task: Task) => void;
  onDelete: (taskId: number) => void;
  onStatusChange: (taskId: number, status: TaskStatus) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  loading,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const columns: ColumnsType<Task> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          {record.tags && (
            <div style={{ marginTop: 4 }}>
              {record.tags.map(tag => (
                <Tag key={tag} size="small">{tag}</Tag>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: TaskStatus) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority: TaskPriority) => (
        <Tag color={getPriorityColor(priority)}>
          {getPriorityText(priority)}
        </Tag>
      ),
    },
    {
      title: '分配给',
      dataIndex: 'assignee',
      key: 'assignee',
      render: (assignee: User) => assignee?.displayName || assignee?.username,
    },
    {
      title: '截止日期',
      dataIndex: 'dueDate',
      key: 'dueDate',
      render: (date: string) => date ? dayjs(date).format('YYYY-MM-DD') : '-',
    },
    {
      title: '操作',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button size="small" onClick={() => onEdit(record)}>
            编辑
          </Button>
          <Dropdown
            menu={{
              items: [
                { key: 'pending', label: '待开始' },
                { key: 'in_progress', label: '进行中' },
                { key: 'completed', label: '已完成' },
                { key: 'cancelled', label: '已取消' },
              ],
              onClick: ({ key }) => onStatusChange(record.id, key as TaskStatus),
            }}
          >
            <Button size="small">状态</Button>
          </Dropdown>
          <Popconfirm
            title="确认删除这个任务吗？"
            onConfirm={() => onDelete(record.id)}
          >
            <Button size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={tasks}
      loading={loading}
      rowKey="id"
      pagination={{
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `共 ${total} 条记录`,
      }}
    />
  );
};
```

### 4.3 状态管理设计

#### 4.3.1 认证上下文
```typescript
// AuthContext.tsx
interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: LoginDto) => Promise<void>;
  logout: () => void;
  updateProfile: (data: UpdateUserDto) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('accessToken')
  );
  const [loading, setLoading] = useState(false);

  const login = async (credentials: LoginDto) => {
    setLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setToken(response.accessToken);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const updateProfile = async (data: UpdateUserDto) => {
    const updatedUser = await userService.updateProfile(data);
    setUser(updatedUser);
  };

  useEffect(() => {
    if (token) {
      // 验证token有效性并获取用户信息
      authService.getProfile()
        .then(setUser)
        .catch(() => logout());
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      login,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
```

### 4.4 API服务设计

#### 4.4.1 HTTP客户端配置
```typescript
// api.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // 请求拦截器
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 响应拦截器
    this.client.interceptors.response.use(
      (response) => response.data,
      async (error) => {
        if (error.response?.status === 401) {
          try {
            await this.refreshToken();
            return this.client.request(error.config);
          } catch {
            this.handleLogout();
          }
        }
        return Promise.reject(error);
      }
    );
  }

  private async refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token');
    }

    const response = await axios.post('/auth/refresh', { refreshToken });
    const { accessToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
  }

  private handleLogout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  }

  public get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.get(url, config);
  }

  public post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.post(url, data, config);
  }

  public put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    return this.client.put(url, data, config);
  }

  public delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    return this.client.delete(url, config);
  }
}

export const apiClient = new ApiClient();
```

### 4.5 路由设计
```typescript
// App.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/AuthContext';
import { Layout } from './components/Layout';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import TasksPage from './pages/Tasks';
import UsersPage from './pages/Users';
import ProfilePage from './pages/Profile';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? <Layout>{children}</Layout> : <Navigate to="/login" />;
};

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  return user?.role === 'admin' ? (
    <>{children}</>
  ) : (
    <Navigate to="/dashboard" />
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tasks"
            element={
              <ProtectedRoute>
                <TasksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <UsersPage />
                </AdminRoute>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

## 5. 接口设计规范

### 5.1 RESTful API设计原则
- 使用HTTP方法表示操作：GET(查询)、POST(创建)、PUT(更新)、DELETE(删除)
- 使用HTTP状态码表示结果：200(成功)、201(创建)、400(客户端错误)、401(未认证)、403(无权限)、404(未找到)、500(服务器错误)
- 统一的响应格式
- 分页查询支持
- 错误信息标准化

### 5.2 响应格式规范
```typescript
// 成功响应
interface SuccessResponse<T> {
  success: true;
  data: T;
  message?: string;
}

// 分页响应
interface PaginatedResponse<T> {
  success: true;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 错误响应
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
}
```

### 5.3 错误处理规范
```typescript
// 全局异常过滤器
@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        message = (exceptionResponse as any).message || exception.message;
        code = (exceptionResponse as any).code || 'HTTP_EXCEPTION';
      } else {
        message = exceptionResponse;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    }

    const errorResponse: ErrorResponse = {
      success: false,
      error: {
        code,
        message,
        details: process.env.NODE_ENV === 'development' ? exception : undefined,
      },
    };

    // 记录错误日志
    console.error(`${request.method} ${request.url}`, exception);

    response.status(status).json(errorResponse);
  }
}
```

## 6. 性能优化

### 6.1 后端性能优化
- 数据库查询优化：添加适当索引、使用查询构建器、避免N+1查询
- 缓存策略：Redis缓存热点数据
- 分页查询：避免全量数据加载
- 数据库连接池：优化连接管理
- 日志优化：生产环境减少日志输出

### 6.2 前端性能优化
- 代码分割：使用React.lazy实现路由级别的代码分割
- 组件懒加载：按需加载组件
- 图片优化：使用WebP格式、懒加载
- 缓存策略：HTTP缓存、本地存储缓存
- 打包优化：Vite构建优化、Tree Shaking

## 7. 监控和日志

### 7.1 日志设计
```typescript
// logger.config.ts
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export const loggerConfig = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message, context }) => {
          return `${timestamp} [${context}] ${level}: ${message}`;
        }),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
});
```

### 7.2 健康检查
```typescript
// health.controller.ts
@Controller('health')
export class HealthController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly typeOrmHealthIndicator: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    return this.healthCheckService.check([
      () => this.typeOrmHealthIndicator.pingCheck('database'),
    ]);
  }
}
```

## 8. 部署和运维

### 8.1 Docker化部署
```dockerfile
# 后端Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist ./dist
COPY data ./data

EXPOSE 3000

CMD ["node", "dist/main"]
```

### 8.2 环境配置
```env
# .env.production
NODE_ENV=production
PORT=3000
DATABASE_PATH=data/task_manager.db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

本技术详细设计文档为任务管理系统的开发提供了全面的技术指导，涵盖了系统架构、模块设计、数据库设计、接口设计、安全设计等各个方面的技术实现细节。