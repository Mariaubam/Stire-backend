import {
  Controller, Get, Post, Put, Delete,
  Param, Body, UseGuards, ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ClassesService } from './classes.service';
import { CreateClassDto, UpdateClassDto, EnrollStudentDto } from './dto/class.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Clases')
@ApiBearerAuth('JWT')
@Controller('classes')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @ApiOperation({ summary: 'Crear clase (teacher/admin)' })
  @Post()
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  create(@Body() dto: CreateClassDto) { return this.classesService.create(dto); }

  @ApiOperation({ summary: 'Listar todas las clases' })
  @Get()
  findAll() { return this.classesService.findAll(); }

  @ApiOperation({ summary: 'Ver clases en las que está inscrito un estudiante' })
  @Get('student/:studentId')
  findByStudent(@Param('studentId', ParseIntPipe) studentId: number) {
    return this.classesService.findByStudent(studentId);
  }

  @ApiOperation({ summary: 'Ver detalle de una clase' })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) { return this.classesService.findOne(id); }

  @ApiOperation({ summary: 'Ver clases de un profesor' })
  @Get('teacher/:teacherId')
  findByTeacher(@Param('teacherId', ParseIntPipe) teacherId: number) {
    return this.classesService.findByTeacher(teacherId);
  }

  @ApiOperation({ summary: 'Actualizar clase (teacher/admin)' })
  @Put(':id')
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateClassDto) {
    return this.classesService.update(id, dto);
  }

  @ApiOperation({ summary: 'Eliminar clase (admin)' })
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id', ParseIntPipe) id: number) { return this.classesService.remove(id); }

  @ApiOperation({ summary: 'Inscribir estudiante en clase (teacher/admin)' })
  @Post(':id/enroll')
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  enrollStudent(@Param('id', ParseIntPipe) id: number, @Body() dto: EnrollStudentDto) {
    return this.classesService.enrollStudent(id, dto.studentId);
  }

  @ApiOperation({ summary: 'Desinscribir estudiante de clase (teacher/admin)' })
  @Delete(':id/students/:studentId')
  @Roles(UserRole.TEACHER, UserRole.ADMIN)
  removeStudent(
    @Param('id', ParseIntPipe) id: number,
    @Param('studentId', ParseIntPipe) studentId: number,
  ) {
    return this.classesService.removeStudent(id, studentId);
  }
}
