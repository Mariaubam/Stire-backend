import { Controller, Get, Post, Put, Param, Body, UseGuards, ParseIntPipe, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProgressService } from './progress.service';
import { CreateProgressDto, UpdateProgressDto } from './dto/progress.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Progreso')
@ApiBearerAuth('JWT')
@Controller('progress')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  // Solo TEACHER y ADMIN crean registros de progreso manualmente
  @Post()
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  create(@Body() dto: CreateProgressDto) { return this.progressService.create(dto); }

  // STUDENT ve su propio progreso; TEACHER y ADMIN ven el de cualquiera
  @Get('student/:studentId')
  findByStudent(
    @Param('studentId', ParseIntPipe) id: number,
    @CurrentUser() currentUser: { id: number; role: UserRole },
  ) {
    if (currentUser.role === UserRole.STUDENT && currentUser.id !== id) {
      throw new ForbiddenException('Solo puedes ver tu propio progreso');
    }
    return this.progressService.findByStudent(id);
  }

  // STUDENT ve sus unidades pendientes de repaso
  @Get('student/:studentId/review')
  findDue(
    @Param('studentId', ParseIntPipe) id: number,
    @CurrentUser() currentUser: { id: number; role: UserRole },
  ) {
    if (currentUser.role === UserRole.STUDENT && currentUser.id !== id) {
      throw new ForbiddenException('Solo puedes ver tu propio plan de repaso');
    }
    return this.progressService.findDueForReview(id);
  }

  // Dashboard personal
  @Get('student/:studentId/dashboard')
  dashboard(
    @Param('studentId', ParseIntPipe) id: number,
    @CurrentUser() currentUser: { id: number; role: UserRole },
  ) {
    if (currentUser.role === UserRole.STUDENT && currentUser.id !== id) {
      throw new ForbiddenException('Solo puedes ver tu propio dashboard');
    }
    return this.progressService.getDashboard(id);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.progressService.findOne(id); }

  // Solo TEACHER y ADMIN ajustan progreso manualmente
  @Put(':id')
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProgressDto) {
    return this.progressService.update(id, dto);
  }
}
