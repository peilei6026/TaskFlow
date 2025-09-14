import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TimeEntriesService } from './time-entries.service';
import { CreateTimeEntryDto, UpdateTimeEntryDto } from './dto/time-entries.dto';

@ApiTags('time-entries')
@Controller('time-entries')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TimeEntriesController {
  constructor(private readonly timeEntriesService: TimeEntriesService) {}

  @Get()
  @ApiOperation({ summary: '获取时间记录列表' })
  async getTimeEntries(
    @Request() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('taskId') taskId?: string,
    @Query('userId') userId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    const taskIdNum = taskId ? parseInt(taskId, 10) : undefined;
    const userIdNum = userId ? parseInt(userId, 10) : undefined;

    return this.timeEntriesService.findAll({
      page: pageNum,
      limit: limitNum,
      taskId: taskIdNum,
      userId: userIdNum,
      startDate,
      endDate,
      currentUserId: req.user.id,
    });
  }

  @Get('stats')
  @ApiOperation({ summary: '获取时间统计' })
  async getTimeStats(
    @Request() req,
    @Query('userId') userId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    const userIdNum = userId ? parseInt(userId, 10) : req.user.id;

    return this.timeEntriesService.getStats({
      userId: userIdNum,
      startDate,
      endDate,
      currentUserId: req.user.id,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: '获取时间记录详情' })
  async getTimeEntryById(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.timeEntriesService.findById(id, req.user.id);
  }

  @Post()
  @ApiOperation({ summary: '创建时间记录' })
  async createTimeEntry(@Body() createTimeEntryDto: CreateTimeEntryDto, @Request() req) {
    return this.timeEntriesService.create(createTimeEntryDto, req.user.id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新时间记录' })
  async updateTimeEntry(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTimeEntryDto: UpdateTimeEntryDto,
    @Request() req,
  ) {
    return this.timeEntriesService.update(id, updateTimeEntryDto, req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除时间记录' })
  async deleteTimeEntry(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.timeEntriesService.delete(id, req.user.id);
  }
}