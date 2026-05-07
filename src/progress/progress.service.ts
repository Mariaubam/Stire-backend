import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual } from 'typeorm';
import { Progress, UrgencyLevel } from './entities/progress.entity';
import { CreateProgressDto, UpdateProgressDto } from './dto/progress.dto';

@Injectable()
export class ProgressService {
  constructor(@InjectRepository(Progress) private readonly progressRepo: Repository<Progress>) {}

  async create(dto: CreateProgressDto): Promise<Progress> {
    const existing = await this.progressRepo.findOne({ where: { studentId: dto.studentId, learningUnitId: dto.learningUnitId } });
    if (existing) return existing;
    return this.progressRepo.save(this.progressRepo.create(dto));
  }

  async findByStudent(studentId: number): Promise<Progress[]> {
    return this.progressRepo.find({ where: { studentId }, relations: ['learningUnit', 'learningUnit.topic'] });
  }

  async findDueForReview(studentId: number): Promise<Progress[]> {
    const now = new Date();
    return this.progressRepo.find({
      where: { studentId, nextReviewDate: LessThanOrEqual(now) },
      relations: ['learningUnit'],
      order: { urgencyLevel: 'DESC' },
    });
  }

  async getDashboard(studentId: number) {
    const all = await this.findByStudent(studentId);
    const due = await this.findDueForReview(studentId);
    const avgMastery = all.length ? all.reduce((s, p) => s + Number(p.mastery), 0) / all.length : 0;
    return {
      totalUnits: all.length,
      avgMastery: Math.round(avgMastery),
      dueForReview: due.length,
      critical: all.filter(p => p.urgencyLevel === UrgencyLevel.CRITICAL).length,
      progress: all,
    };
  }

  async findOne(id: number): Promise<Progress> {
    const prog = await this.progressRepo.findOne({ where: { id }, relations: ['student', 'learningUnit'] });
    if (!prog) throw new NotFoundException(`Progreso #${id} no encontrado`);
    return prog;
  }

  async update(id: number, dto: UpdateProgressDto): Promise<Progress> {
    const prog = await this.findOne(id);
    Object.assign(prog, dto);
    return this.progressRepo.save(prog);
  }
}
