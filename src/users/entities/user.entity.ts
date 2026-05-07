import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  UpdateDateColumn, OneToMany, ManyToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Class } from '../../classes/entities/class.entity';
import { Submission } from '../../submissions/entities/submission.entity';
import { Progress } from '../../progress/entities/progress.entity';
import { Message } from '../../messages/entities/message.entity';

export enum UserRole {
  TEACHER = 'teacher',
  STUDENT = 'student',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  fullName: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.STUDENT })
  role: UserRole;

  @Column({ nullable: true, length: 50 })
  semestre: string;

  @Column({ nullable: true, length: 150 })
  programa: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Un profesor puede tener muchas clases
  @OneToMany(() => Class, (cls) => cls.teacher)
  taughtClasses: Class[];

  // Un estudiante puede estar en muchas clases (N:M)
  @ManyToMany(() => Class, (cls) => cls.students)
  enrolledClasses: Class[];

  @OneToMany(() => Submission, (sub) => sub.student)
  submissions: Submission[];

  @OneToMany(() => Progress, (prog) => prog.student)
  progressRecords: Progress[];

  @OneToMany(() => Message, (msg) => msg.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (msg) => msg.receiver)
  receivedMessages: Message[];
}
