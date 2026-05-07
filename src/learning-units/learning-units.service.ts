import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LearningUnit } from './entities/learning-unit.entity';
import { CreateLearningUnitDto, UpdateLearningUnitDto } from './dto/learning-unit.dto';

@Injectable()
export class LearningUnitsService {
  constructor(@InjectRepository(LearningUnit) private readonly luRepo: Repository<LearningUnit>) {}

  async create(dto: CreateLearningUnitDto): Promise<LearningUnit> {
    const lu = this.luRepo.create(dto);
    return this.luRepo.save(lu);
  }
  async findAll(): Promise<LearningUnit[]> {
    return this.luRepo.find({ relations: ['topic'] });
  }
  async findByTopic(topicId: number): Promise<LearningUnit[]> {
    return this.luRepo.find({ where: { topicId }, order: { order: 'ASC' }, relations: ['evaluations'] });
  }
  async findOne(id: number): Promise<LearningUnit> {
    const lu = await this.luRepo.findOne({ where: { id }, relations: ['topic', 'evaluations'] });
    if (!lu) throw new NotFoundException(`Unidad de aprendizaje #${id} no encontrada`);
    return lu;
  }
  async update(id: number, dto: UpdateLearningUnitDto): Promise<LearningUnit> {
    const lu = await this.findOne(id);
    Object.assign(lu, dto);
    return this.luRepo.save(lu);
  }
  async remove(id: number): Promise<void> {
    const lu = await this.findOne(id);
    await this.luRepo.remove(lu);
  }
}
