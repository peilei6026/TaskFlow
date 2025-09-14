import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCalendarEventDto } from './dto/create-calendar-event.dto';
import { UpdateCalendarEventDto } from './dto/update-calendar-event.dto';
import { CalendarEvent } from '@prisma/client';

@Injectable()
export class CalendarService {
  constructor(private prisma: PrismaService) {}

  async create(createCalendarEventDto: CreateCalendarEventDto, userId: number): Promise<CalendarEvent> {
    const { attendees, ...eventData } = createCalendarEventDto;

    return this.prisma.calendarEvent.create({
      data: {
        ...eventData,
        attendees: attendees ? JSON.stringify(attendees) : null,
        userId,
        startTime: new Date(createCalendarEventDto.startTime),
        endTime: new Date(createCalendarEventDto.endTime),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            displayName: true,
          },
        },
      },
    });
  }

  async findAll(userId: number, startDate?: string, endDate?: string): Promise<CalendarEvent[]> {
    const where: any = { userId };

    if (startDate || endDate) {
      where.AND = [];

      if (startDate) {
        where.AND.push({
          endTime: {
            gte: new Date(startDate),
          },
        });
      }

      if (endDate) {
        where.AND.push({
          startTime: {
            lte: new Date(endDate),
          },
        });
      }
    }

    return this.prisma.calendarEvent.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            displayName: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });
  }

  async findOne(id: number, userId: number): Promise<CalendarEvent> {
    const event = await this.prisma.calendarEvent.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            displayName: true,
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Calendar event with ID ${id} not found`);
    }

    return event;
  }

  async update(id: number, updateCalendarEventDto: UpdateCalendarEventDto, userId: number): Promise<CalendarEvent> {
    // 验证事件所有权
    await this.findOne(id, userId);

    const { attendees, ...eventData } = updateCalendarEventDto;

    const updateData: any = { ...eventData };

    if (attendees !== undefined) {
      updateData.attendees = attendees ? JSON.stringify(attendees) : null;
    }

    if (updateCalendarEventDto.startTime) {
      updateData.startTime = new Date(updateCalendarEventDto.startTime);
    }

    if (updateCalendarEventDto.endTime) {
      updateData.endTime = new Date(updateCalendarEventDto.endTime);
    }

    return this.prisma.calendarEvent.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            displayName: true,
          },
        },
      },
    });
  }

  async remove(id: number, userId: number): Promise<CalendarEvent> {
    // 验证事件所有权
    const event = await this.findOne(id, userId);

    return this.prisma.calendarEvent.delete({
      where: { id },
    });
  }

  async findByMonth(year: number, month: number, userId: number): Promise<CalendarEvent[]> {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    return this.prisma.calendarEvent.findMany({
      where: {
        userId,
        OR: [
          {
            startTime: {
              gte: startDate,
              lte: endDate,
            },
          },
          {
            endTime: {
              gte: startDate,
              lte: endDate,
            },
          },
          {
            AND: [
              {
                startTime: {
                  lt: startDate,
                },
              },
              {
                endTime: {
                  gt: endDate,
                },
              },
            ],
          },
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            displayName: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });
  }
}