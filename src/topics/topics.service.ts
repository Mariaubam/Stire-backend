import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Topic } from './entities/topic.entity';
import { CreateTopicDto, UpdateTopicDto } from './dto/topic.dto';

@Injectable()
export class TopicsService {
  constructor(@InjectRepository(Topic) private readonly topicRepo: Repository<Topic>) {}

  async create(dto: CreateTopicDto): Promise<Topic> {
    const topic = this.topicRepo.create(dto);
    return this.topicRepo.save(topic);
  }
  async findAll(): Promise<Topic[]> {
    return this.topicRepo.find({ relations: ['class', 'learningUnits'] });
  }
  async findByClass(classId: number): Promise<Topic[]> {
    return this.topicRepo.find({ where: { classId }, order: { order: 'ASC' }, relations: ['learningUnits'] });
  }
  async findOne(id: number): Promise<Topic> {
    const topic = await this.topicRepo.findOne({ where: { id }, relations: ['class', 'learningUnits'] });
    if (!topic) throw new NotFoundException(`Tema #${id} no encontrado`);
    return topic;
  }
  async update(id: number, dto: UpdateTopicDto): Promise<Topic> {
    const topic = await this.findOne(id);
    Object.assign(topic, dto);
    return this.topicRepo.save(topic);
  }
  async remove(id: number): Promise<void> {
    const topic = await this.findOne(id);
    await this.topicRepo.remove(topic);
  }
}
