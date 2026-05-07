import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LearningUnitsService } from './learning-units.service';
import { CreateLearningUnitDto, UpdateLearningUnitDto } from './dto/learning-unit.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Unidades de Aprendizaje')
@ApiBearerAuth('JWT')
@Controller('learning-units')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LearningUnitsController {
  constructor(private readonly luService: LearningUnitsService) {}

  @Post()
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  create(@Body() dto: CreateLearningUnitDto) { return this.luService.create(dto); }

  @Get()
  findAll() { return this.luService.findAll(); }

  @Get('topic/:topicId')
  findByTopic(@Param('topicId', ParseIntPipe) id: number) { return this.luService.findByTopic(id); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.luService.findOne(id); }

  @Put(':id')
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateLearningUnitDto) { return this.luService.update(id, dto); }

  @Delete(':id')
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) { return this.luService.remove(id); }
}
