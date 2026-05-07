import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Evaluation } from './entities/evaluation.entity';
import { CreateEvaluationDto, UpdateEvaluationDto } from './dto/evaluation.dto';

@Injectable()
export class EvaluationsService {
  constructor(@InjectRepository(Evaluation) private readonly evalRepo: Repository<Evaluation>) {}
  async create(dto: CreateEvaluationDto): Promise<Evaluation> {
    return this.evalRepo.save(this.evalRepo.create(dto));
  }
  async findAll(): Promise<Evaluation[]> {
    return this.evalRepo.find({ relations: ['learningUnit'] });
  }
  async findByLearningUnit(learningUnitId: number): Promise<Evaluation[]> {
    return this.evalRepo.find({ where: { learningUnitId } });
  }
  async findOne(id: number): Promise<Evaluation> {
    const ev = await this.evalRepo.findOne({ where: { id }, relations: ['learningUnit', 'submissions'] });
    if (!ev) throw new NotFoundException(`Evaluación #${id} no encontrada`);
    return ev;
  }
  async update(id: number, dto: UpdateEvaluationDto): Promise<Evaluation> {
    const ev = await this.findOne(id);
    Object.assign(ev, dto);
    return this.evalRepo.save(ev);
  }
  async remove(id: number): Promise<void> {
    const ev = await this.findOne(id);
    await this.evalRepo.remove(ev);
  }
}
