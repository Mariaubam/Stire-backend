import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { Topic } from '../../topics/entities/topic.entity';
import { Evaluation } from '../../evaluations/entities/evaluation.entity';
import { Progress } from '../../progress/entities/progress.entity';

export enum ContentType {
  VIDEO = 'video',
  TEXT = 'text',
  QUIZ = 'quiz',
  MIXED = 'mixed',
}

export enum DifficultyLevel {
  BASICO = 'basico',
  INTERMEDIO = 'intermedio',
  AVANZADO = 'avanzado',
}

@Entity('learning_units')
export class LearningUnit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'enum', enum: ContentType, default: ContentType.MIXED })
  contentType: ContentType;

  @Column({ type: 'enum', enum: DifficultyLevel, default: DifficultyLevel.BASICO })
  difficulty: DifficultyLevel;

  @Column({ default: 0 })
  order: number;

  @Column({ type: 'int', default: 30 })
  estimatedMinutes: number; // duración estimada

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Topic, (topic) => topic.learningUnits, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'topicId' })
  topic: Topic;

  @Column()
  topicId: number;

  @OneToMany(() => Evaluation, (ev) => ev.learningUnit)
  evaluations: Evaluation[];

  @OneToMany(() => Progress, (prog) => prog.learningUnit)
  progressRecords: Progress[];
}
