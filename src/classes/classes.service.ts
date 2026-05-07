import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Class } from './entities/class.entity';
import { User } from '../users/entities/user.entity';
import { CreateClassDto, UpdateClassDto } from './dto/class.dto';

@Injectable()
export class ClassesService {
  constructor(
    @InjectRepository(Class) private readonly classRepo: Repository<Class>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async create(dto: CreateClassDto): Promise<Class> {
    const code = dto.code || Math.random().toString(36).substring(2, 8).toUpperCase();
    const cls = this.classRepo.create({ ...dto, code });
    return this.classRepo.save(cls);
  }

  async findAll(): Promise<Class[]> {
    const classes = await this.classRepo.find({ relations: ['teacher', 'topics'] });
    classes.forEach(c => { if (c.teacher) delete (c.teacher as any).password; });
    return classes;
  }

  async findOne(id: number): Promise<Class> {
    const cls = await this.classRepo.findOne({ where: { id }, relations: ['teacher', 'students', 'topics'] });
    if (!cls) throw new NotFoundException(`Clase #${id} no encontrada`);
    if (cls.teacher) delete (cls.teacher as any).password;
    cls.students?.forEach(s => delete (s as any).password);
    return cls;
  }

  async findByTeacher(teacherId: number): Promise<Class[]> {
    return this.classRepo.find({ where: { teacherId }, relations: ['topics'] });
  }

  async findByStudent(studentId: number): Promise<Class[]> {
    return this.classRepo
      .createQueryBuilder('class')
      .innerJoin('class.students', 'student', 'student.id = :studentId', { studentId })
      .leftJoinAndSelect('class.teacher', 'teacher')
      .leftJoinAndSelect('class.topics', 'topics')
      .getMany()
      .then(classes => {
        classes.forEach(c => { if (c.teacher) delete (c.teacher as any).password; });
        return classes;
      });
  }

  async update(id: number, dto: UpdateClassDto): Promise<Class> {
    const cls = await this.findOne(id);
    Object.assign(cls, dto);
    return this.classRepo.save(cls);
  }

  async remove(id: number): Promise<void> {
    const cls = await this.findOne(id);
    await this.classRepo.remove(cls);
  }

  async enrollStudent(classId: number, studentId: number): Promise<Class> {
    const cls = await this.classRepo.findOne({ where: { id: classId }, relations: ['students'] });
    if (!cls) throw new NotFoundException(`Clase #${classId} no encontrada`);

    const student = await this.userRepo.findOne({ where: { id: studentId } });
    if (!student) throw new NotFoundException(`Estudiante #${studentId} no encontrado`);

    const alreadyEnrolled = cls.students.some(s => s.id === studentId);
    if (!alreadyEnrolled) {
      cls.students.push(student);
      await this.classRepo.save(cls);
    }
    return cls;
  }

  async removeStudent(classId: number, studentId: number): Promise<Class> {
    const cls = await this.classRepo.findOne({ where: { id: classId }, relations: ['students'] });
    if (!cls) throw new NotFoundException(`Clase #${classId} no encontrada`);
    cls.students = cls.students.filter(s => s.id !== studentId);
    return this.classRepo.save(cls);
  }
}
