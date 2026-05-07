import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, OneToMany, JoinColumn,
} from 'typeorm';
import { LearningUnit } from '../../learning-units/entities/learning-unit.entity';
import { Submission } from '../../submissions/entities/submission.entity';

export enum EvaluationType {
  QUIZ = 'quiz',
  EXAM = 'exam',
  PRACTICE = 'practice',
}

@Entity('evaluations')
export class Evaluation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'enum', enum: EvaluationType, default: EvaluationType.QUIZ })
  type: EvaluationType;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 100 })
  maxScore: number;

  @Column({ type: 'json', nullable: true })
  questions: object; // Array de preguntas en JSON

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => LearningUnit, (lu) => lu.evaluations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'learningUnitId' })
  learningUnit: LearningUnit;

  @Column()
  learningUnitId: number;

  @OneToMany(() => Submission, (sub) => sub.evaluation)
  submissions: Submission[];
}
