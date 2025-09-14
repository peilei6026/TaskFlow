-- 添加数据库索引以优化查询性能

-- 用户表索引
CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users"("email");
CREATE INDEX IF NOT EXISTS "idx_users_username" ON "users"("username");
CREATE INDEX IF NOT EXISTS "idx_users_status" ON "users"("status");
CREATE INDEX IF NOT EXISTS "idx_users_role" ON "users"("role");

-- 任务表索引
CREATE INDEX IF NOT EXISTS "idx_tasks_assignee_id" ON "tasks"("assigneeId");
CREATE INDEX IF NOT EXISTS "idx_tasks_creator_id" ON "tasks"("creatorId");
CREATE INDEX IF NOT EXISTS "idx_tasks_status" ON "tasks"("status");
CREATE INDEX IF NOT EXISTS "idx_tasks_priority" ON "tasks"("priority");
CREATE INDEX IF NOT EXISTS "idx_tasks_due_date" ON "tasks"("dueDate");
CREATE INDEX IF NOT EXISTS "idx_tasks_created_at" ON "tasks"("createdAt");
CREATE INDEX IF NOT EXISTS "idx_tasks_updated_at" ON "tasks"("updatedAt");

-- 复合索引：按状态和优先级排序
CREATE INDEX IF NOT EXISTS "idx_tasks_status_priority" ON "tasks"("status", "priority");
CREATE INDEX IF NOT EXISTS "idx_tasks_assignee_status" ON "tasks"("assigneeId", "status");

-- 任务评论表索引
CREATE INDEX IF NOT EXISTS "idx_task_comments_task_id" ON "task_comments"("taskId");
CREATE INDEX IF NOT EXISTS "idx_task_comments_user_id" ON "task_comments"("userId");
CREATE INDEX IF NOT EXISTS "idx_task_comments_created_at" ON "task_comments"("createdAt");

-- 时间记录表索引
CREATE INDEX IF NOT EXISTS "idx_time_entries_user_id" ON "time_entries"("userId");
CREATE INDEX IF NOT EXISTS "idx_time_entries_task_id" ON "time_entries"("taskId");
CREATE INDEX IF NOT EXISTS "idx_time_entries_date" ON "time_entries"("date");
CREATE INDEX IF NOT EXISTS "idx_time_entries_created_at" ON "time_entries"("createdAt");

-- 日历事件表索引
CREATE INDEX IF NOT EXISTS "idx_calendar_events_user_id" ON "calendar_events"("userId");
CREATE INDEX IF NOT EXISTS "idx_calendar_events_start_time" ON "calendar_events"("startTime");
CREATE INDEX IF NOT EXISTS "idx_calendar_events_end_time" ON "calendar_events"("endTime");
CREATE INDEX IF NOT EXISTS "idx_calendar_events_type" ON "calendar_events"("type");

-- 刷新令牌表索引
CREATE INDEX IF NOT EXISTS "idx_refresh_tokens_user_id" ON "refresh_tokens"("userId");
CREATE INDEX IF NOT EXISTS "idx_refresh_tokens_token" ON "refresh_tokens"("token");
CREATE INDEX IF NOT EXISTS "idx_refresh_tokens_expires_at" ON "refresh_tokens"("expiresAt");
