import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { EvaluationsService } from './evaluations.service';
import { CreateEvaluationDto, UpdateEvaluationDto } from './dto/evaluation.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Evaluaciones')
@ApiBearerAuth('JWT')
@Controller('evaluations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EvaluationsController {
  constructor(private readonly evalService: EvaluationsService) {}

  // Solo TEACHER y ADMIN crean evaluaciones
  @Post()
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  create(@Body() dto: CreateEvaluationDto) { return this.evalService.create(dto); }

  // Todos ven evaluaciones
  @Get()
  findAll() { return this.evalService.findAll(); }

  @Get('learning-unit/:id')
  findByLU(@Param('id', ParseIntPipe) id: number) { return this.evalService.findByLearningUnit(id); }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.evalService.findOne(id); }

  @Put(':id')
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateEvaluationDto) { return this.evalService.update(id, dto); }

  @Delete(':id')
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) { return this.evalService.remove(id); }
}
