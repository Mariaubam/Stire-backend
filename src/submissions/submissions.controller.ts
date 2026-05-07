import { Controller, Get, Post, Param, Body, UseGuards, ParseIntPipe, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SubmissionsService } from './submissions.service';
import { CreateSubmissionDto } from './dto/submission.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Entregas')
@ApiBearerAuth('JWT')
@Controller('submissions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubmissionsController {
  constructor(private readonly subService: SubmissionsService) {}

  // Solo STUDENT puede entregar (y solo puede entregar por sí mismo)
  @Post()
  @Roles(UserRole.STUDENT)
  create(
    @Body() dto: CreateSubmissionDto,
    @CurrentUser() currentUser: { id: number; role: UserRole },
  ) {
    if (dto.studentId !== currentUser.id) {
      throw new ForbiddenException('Solo puedes entregar evaluaciones en tu propio nombre');
    }
    return this.subService.create(dto);
  }

  // TEACHER y ADMIN pueden ver todas las entregas
  @Get()
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  findAll() { return this.subService.findAll(); }

  // STUDENT solo puede ver sus propias entregas; TEACHER y ADMIN pueden ver las de cualquiera
  @Get('student/:studentId')
  findByStudent(
    @Param('studentId', ParseIntPipe) id: number,
    @CurrentUser() currentUser: { id: number; role: UserRole },
  ) {
    if (currentUser.role === UserRole.STUDENT && currentUser.id !== id) {
      throw new ForbiddenException('Solo puedes ver tus propias entregas');
    }
    return this.subService.findByStudent(id);
  }

  // TEACHER y ADMIN pueden ver el detalle de cualquier entrega
  @Get(':id')
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  findOne(@Param('id', ParseIntPipe) id: number) { return this.subService.findOne(id); }
}
