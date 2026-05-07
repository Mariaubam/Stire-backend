import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { LearningUnit } from '../../learning-units/entities/learning-unit.entity';

export enum ProgressState {
  NOT_STARTED = 'not_started',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  NEEDS_REVIEW = 'needs_review',
}

export enum UrgencyLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

@Entity('progress')
export class Progress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: ProgressState, default: ProgressState.NOT_STARTED })
  state: ProgressState;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  mastery: number; // 0-100

  @Column({ type: 'datetime', nullable: true })
  nextReviewDate: Date; // repetición espaciada

  @Column({ type: 'enum', enum: UrgencyLevel, default: UrgencyLevel.LOW })
  urgencyLevel: UrgencyLevel;

  @Column({ default: 0 })
  reviewCount: number; // cuántas veces ha revisado

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 2.5 })
  easeFactor: number; // factor del algoritmo SM-2

  @Column({ default: 1 })
  interval: number; // días hasta próxima revisión

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.progressRecords)
  @JoinColumn({ name: 'studentId' })
  student: User;

  @Column()
  studentId: number;

  @ManyToOne(() => LearningUnit, (lu) => lu.progressRecords)
  @JoinColumn({ name: 'learningUnitId' })
  learningUnit: LearningUnit;

  @Column()
  learningUnitId: number;
}
