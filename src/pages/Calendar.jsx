import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Form, Input, DatePicker, Select, message } from 'antd';
import { PlusOutlined, CalendarOutlined } from '@ant-design/icons';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import calendarService from '../services/calendarService';
import userService from '../services/userService';
import taskService from '../services/taskService';
import { useAuth } from '../hooks/useAuth';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [form] = Form.useForm();
  const { user } = useAuth();

  const eventTypes = [
    { value: 'MEETING', label: '会议', color: '#1890ff' },
    { value: 'DEADLINE', label: '截止日期', color: '#f5222d' },
    { value: 'REMINDER', label: '提醒', color: '#fa8c16' },
    { value: 'PERSONAL', label: '个人', color: '#722ed1' }
  ];

  useEffect(() => {
    fetchEvents();
    fetchUsers();
    fetchTasks();
  }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await calendarService.getEvents();
      if (response.success) {
        const calendarEvents = response.data.map(event => {
          console.log('Processing event:', event);
          return {
            id: event.id.toString(),
            title: event.title,
            start: new Date(event.startTime).toISOString(),
            end: new Date(event.endTime).toISOString(),
            backgroundColor: getEventColor(event.type),
            borderColor: getEventColor(event.type),
            textColor: '#fff',
            display: 'block',
            extendedProps: {
              type: event.type,
              description: event.description,
              location: event.location,
              attendees: event.attendees ? (
                typeof event.attendees === 'string' ?
                JSON.parse(event.attendees) :
                event.attendees
              ) : []
            }
          };
        });
        console.log('Calendar events to display:', calendarEvents);
        setEvents(calendarEvents);
      } else {
        console.warn('Failed to fetch calendar events:', response);
        message.error('获取日历事件失败，请刷新页面重试');
      }
    } catch (error) {
      console.error('Fetch calendar events error:', error);
      message.error('获取日历事件失败，请检查网络连接');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userService.getUsers();
      if (response.success) {
        setUsers(response.data.users || response.data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await taskService.getTasks();
      if (response.success) {
        setTasks(response.data.tasks || response.data);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const getEventColor = (type) => {
    const eventType = eventTypes.find(t => t.value === type);
    return eventType ? eventType.color : '#1890ff';
  };

  const handleDateSelect = (selectInfo) => {
    const start = dayjs(selectInfo.start);
    const end = dayjs(selectInfo.end);

    form.setFieldsValue({
      start: start,
      end: end,
      timeRange: [start, end]
    });

    setEditingEvent(null);
    setModalVisible(true);
  };

  const handleEventClick = (clickInfo) => {
    const event = clickInfo.event;
    const eventData = {
      id: event.id,
      title: event.title,
      start: dayjs(event.start),
      end: dayjs(event.end),
      type: event.extendedProps.type,
      description: event.extendedProps.description,
      location: event.extendedProps.location,
      attendees: event.extendedProps.attendees,
      taskId: event.extendedProps.taskId,
      timeRange: [dayjs(event.start), dayjs(event.end)]
    };

    setEditingEvent(eventData);
    form.setFieldsValue(eventData);
    setModalVisible(true);
  };

  const handleCreate = () => {
    setEditingEvent(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = async (values) => {
    try {
      const eventData = {
        title: values.title,
        startTime: values.timeRange[0].toISOString(),
        endTime: values.timeRange[1].toISOString(),
        type: values.type || 'MEETING',
        description: values.description,
        location: values.location,
        attendees: values.attendees || []
      };

      let response;
      if (editingEvent) {
        response = await calendarService.updateEvent(editingEvent.id, eventData);
      } else {
        response = await calendarService.createEvent(eventData);
      }

      if (response.success) {
        message.success(editingEvent ? '事件更新成功！' : '事件创建成功！');
        setModalVisible(false);
        form.resetFields();
        fetchEvents();
      } else {
        message.error(response.error?.message || (editingEvent ? '更新失败，请稍后重试' : '创建失败，请稍后重试'));
      }
    } catch (error) {
      console.error('Calendar event operation failed:', error);
      message.error(editingEvent ? '更新失败，请检查网络连接' : '创建失败，请检查网络连接');
    }
  };

  const handleDelete = async () => {
    if (!editingEvent) return;

    try {
      const response = await calendarService.deleteEvent(editingEvent.id);
      if (response.success) {
        message.success('事件删除成功！');
        setModalVisible(false);
        setEditingEvent(null);
        fetchEvents();
      } else {
        message.error(response.error?.message || '删除失败，请稍后重试');
      }
    } catch (error) {
      console.error('Calendar event delete failed:', error);
      message.error('删除失败，请检查网络连接');
    }
  };

  return (
    <div>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CalendarOutlined style={{ marginRight: 8 }} />
            日历管理
          </div>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleCreate}
          >
            新建事件
          </Button>
        }
      >
        <div style={{ height: 'calc(100vh - 300px)', minHeight: '600px' }}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView="dayGridMonth"
            locale="zh-cn"
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={events}
            select={handleDateSelect}
            eventClick={handleEventClick}
            height="100%"
            loading={loading}
            eventDisplay="block"
            firstDay={1}
            eventDidMount={(info) => {
              console.log('Event mounted:', info.event);
            }}
            eventContent={(eventInfo) => {
              console.log('Rendering event:', eventInfo.event);
              return {
                html: `<div style="padding: 2px 4px; overflow: hidden;">
                  <div style="font-weight: bold; font-size: 12px;">${eventInfo.event.title}</div>
                  ${eventInfo.event.extendedProps.location ?
                    `<div style="font-size: 10px; opacity: 0.8;">📍 ${eventInfo.event.extendedProps.location}</div>` :
                    ''
                  }
                </div>`
              };
            }}
          />
        </div>
      </Card>

      <Modal
        title={editingEvent ? '编辑事件' : '新建事件'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          editingEvent && (
            <Button key="delete" danger onClick={handleDelete}>
              删除
            </Button>
          ),
          <Button key="cancel" onClick={() => setModalVisible(false)}>
            取消
          </Button>,
          <Button key="submit" type="primary" onClick={() => form.submit()}>
            {editingEvent ? '更新' : '创建'}
          </Button>
        ].filter(Boolean)}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="事件标题"
            rules={[{ required: true, message: '请输入事件标题' }]}
          >
            <Input placeholder="请输入事件标题" />
          </Form.Item>

          <Form.Item
            name="type"
            label="事件类型"
            rules={[{ required: true, message: '请选择事件类型' }]}
          >
            <Select placeholder="请选择事件类型">
              {eventTypes.map(type => (
                <Option key={type.value} value={type.value}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        backgroundColor: type.color,
                        borderRadius: 2,
                        marginRight: 8
                      }}
                    />
                    {type.label}
                  </div>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="timeRange"
            label="时间范围"
            rules={[{ required: true, message: '请选择时间范围' }]}
          >
            <RangePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
              placeholder={['开始时间', '结束时间']}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="事件描述"
          >
            <TextArea rows={3} placeholder="请输入事件描述" />
          </Form.Item>

          <Form.Item
            name="location"
            label="地点"
          >
            <Input placeholder="请输入地点" />
          </Form.Item>

          <Form.Item
            name="attendees"
            label="参与人员"
          >
            <Select
              mode="multiple"
              placeholder="请选择参与人员"
              allowClear
            >
              {users.map(user => (
                <Option key={user.id} value={user.id}>
                  {user.displayName || user.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="taskId"
            label="关联任务"
          >
            <Select placeholder="请选择关联任务（可选）" allowClear>
              {tasks.map(task => (
                <Option key={task.id} value={task.id}>
                  {task.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Calendar;