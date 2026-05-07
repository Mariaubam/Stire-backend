import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Submission } from './entities/submission.entity';
import { Progress, ProgressState, UrgencyLevel } from '../progress/entities/progress.entity';
import { Evaluation } from '../evaluations/entities/evaluation.entity';

export class CreateSubmissionDto {
  studentId: number;
  evaluationId: number;
  answers?: object;
  score?: number;
}

@Injectable()
export class SubmissionsService {
  constructor(
    @InjectRepository(Submission) private readonly subRepo: Repository<Submission>,
    @InjectRepository(Progress) private readonly progressRepo: Repository<Progress>,
    @InjectRepository(Evaluation) private readonly evalRepo: Repository<Evaluation>,
  ) {}

  async create(dto: CreateSubmissionDto): Promise<Submission> {
    if (dto.score === undefined || dto.score === null) {
      dto.score = await this.calculateScore(dto.evaluationId, dto.answers as any[] || []);
    }

    const submission = this.subRepo.create(dto);
    const saved = await this.subRepo.save(submission);

    await this.recalculateMastery(dto.studentId, dto.evaluationId, dto.score);

    return saved;
  }

  private async calculateScore(evaluationId: number, answers: Array<{ questionIndex: number; selectedOption: number }>): Promise<number> {
    const evaluation = await this.evalRepo.findOne({ where: { id: evaluationId } });
    if (!evaluation || !evaluation.questions) return 0;

    const questions = evaluation.questions as any[];
    if (!Array.isArray(questions) || questions.length === 0) return 0;

    const correct = answers.filter(a => {
      const q = questions[a.questionIndex];
      return q && q.correct === a.selectedOption;
    }).length;

    return Math.round((correct / questions.length) * Number(evaluation.maxScore));
  }

  async findAll(): Promise<Submission[]> {
    return this.subRepo.find({ relations: ['student', 'evaluation'] });
  }

  async findByStudent(studentId: number): Promise<Submission[]> {
    return this.subRepo.find({
      where: { studentId },
      relations: ['evaluation'],
      order: { submittedAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Submission> {
    const sub = await this.subRepo.findOne({ where: { id }, relations: ['student', 'evaluation'] });
    if (!sub) throw new NotFoundException(`Entrega #${id} no encontrada`);
    return sub;
  }

  // ══════════════════════════════════════════════════
  //  ALGORITMO SM-2 — Repetición Espaciada
  // ══════════════════════════════════════════════════
  private async recalculateMastery(studentId: number, evaluationId: number, score: number): Promise<void> {
    const evaluation = await this.evalRepo.findOne({
      where: { id: evaluationId },
      relations: ['learningUnit'],
    });
    if (!evaluation) return;

    const learningUnitId = evaluation.learningUnit.id;

    // Buscar o crear registro de progreso
    let progress = await this.progressRepo.findOne({ where: { studentId, learningUnitId } });
    if (!progress) {
      progress = this.progressRepo.create({ studentId, learningUnitId, mastery: 0, easeFactor: 2.5, interval: 1, reviewCount: 0 });
    }

    // Calcular calidad de respuesta (0-5) basado en score porcentual
    const percentage = (score / Number(evaluation.maxScore)) * 100;
    const quality = Math.round((percentage / 100) * 5); // 0-5

    // Aplicar SM-2 (convertir decimals de MySQL a número)
    const { newEaseFactor, newInterval } = this.sm2(quality, Number(progress.easeFactor), Number(progress.interval), progress.reviewCount);

    // Actualizar mastery con media ponderada
    const previousMastery = Number(progress.mastery);
    const newMastery = Math.min(100, Math.round(previousMastery * 0.6 + percentage * 0.4));

    progress.mastery = newMastery;
    progress.easeFactor = newEaseFactor;
    progress.interval = newInterval;
    progress.reviewCount += 1;
    progress.nextReviewDate = this.addDays(new Date(), newInterval);
    progress.state = newMastery >= 80 ? ProgressState.COMPLETED : ProgressState.IN_PROGRESS;
    progress.urgencyLevel = this.getUrgencyLevel(newMastery, progress.nextReviewDate);

    await this.progressRepo.save(progress);
  }

  private sm2(quality: number, easeFactor: number, interval: number, repetitions: number) {
    let newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (newEaseFactor < 1.3) newEaseFactor = 1.3;

    let newInterval: number;
    if (quality < 3) {
      newInterval = 1;
    } else if (repetitions === 0) {
      newInterval = 1;
    } else if (repetitions === 1) {
      newInterval = 6;
    } else {
      newInterval = Math.round(interval * newEaseFactor);
    }

    return { newEaseFactor, newInterval };
  }

  private addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  private getUrgencyLevel(mastery: number, nextReview: Date): UrgencyLevel {
    const daysLeft = Math.ceil((nextReview.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (mastery < 40 || daysLeft <= 0) return UrgencyLevel.CRITICAL;
    if (mastery < 60 || daysLeft <= 1) return UrgencyLevel.HIGH;
    if (mastery < 80 || daysLeft <= 3) return UrgencyLevel.MEDIUM;
    return UrgencyLevel.LOW;
  }
}
