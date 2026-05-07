import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Evaluation } from '../../evaluations/entities/evaluation.entity';

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  score: number;

  @Column({ type: 'json', nullable: true })
  answers: object; // respuestas del estudiante

  @Column({ type: 'text', nullable: true })
  feedback: string; // retroalimentación automática o del tutor

  @CreateDateColumn()
  submittedAt: Date;

  @ManyToOne(() => User, (user) => user.submissions, { eager: false })
  @JoinColumn({ name: 'studentId' })
  student: User;

  @Column()
  studentId: number;

  @ManyToOne(() => Evaluation, (ev) => ev.submissions, { eager: false })
  @JoinColumn({ name: 'evaluationId' })
  evaluation: Evaluation;

  @Column()
  evaluationId: number;
}
