import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn,
  ManyToOne, OneToMany, ManyToMany, JoinTable, JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Topic } from '../../topics/entities/topic.entity';

@Entity('classes')
export class Class {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true, length: 20 })
  code: string; // código de invitación

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  // Relación: un teacher → muchas classes
  @ManyToOne(() => User, (user) => user.taughtClasses, { eager: false })
  @JoinColumn({ name: 'teacherId' })
  teacher: User;

  @Column()
  teacherId: number;

  // Relación N:M con estudiantes
  @ManyToMany(() => User, (user) => user.enrolledClasses)
  @JoinTable({
    name: 'class_students',
    joinColumn: { name: 'classId', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'studentId', referencedColumnName: 'id' },
  })
  students: User[];

  @OneToMany(() => Topic, (topic) => topic.class)
  topics: Topic[];
}
