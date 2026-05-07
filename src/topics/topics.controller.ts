import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TopicsService } from './topics.service';
import { CreateTopicDto, UpdateTopicDto } from './dto/topic.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Temas')
@ApiBearerAuth('JWT')
@Controller('topics')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TopicsController {
  constructor(private readonly topicsService: TopicsService) {}

  // Solo TEACHER y ADMIN crean temas
  @Post()
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  create(@Body() dto: CreateTopicDto) { return this.topicsService.create(dto); }

  // Todos ven los temas
  @Get()
  findAll() { return this.topicsService.findAll(); }

  @Get('class/:classId')
  findByClass(@Param('classId', ParseIntPipe) id: number) { return this.topicsService.findByClass(id); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.topicsService.findOne(id); }

  // Solo TEACHER y ADMIN editan
  @Put(':id')
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTopicDto) { return this.topicsService.update(id, dto); }

  // Solo ADMIN elimina
  @Delete(':id')
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) { return this.topicsService.remove(id); }
}
