import { IsNumber, IsOptional, IsEnum } from 'class-validator';
import { ProgressState, UrgencyLevel } from '../entities/progress.entity';
export class CreateProgressDto {
  @IsNumber() studentId: number;
  @IsNumber() learningUnitId: number;
}
export class UpdateProgressDto {
  @IsEnum(ProgressState) @IsOptional() state?: ProgressState;
  @IsNumber() @IsOptional() mastery?: number;
  @IsEnum(UrgencyLevel) @IsOptional() urgencyLevel?: UrgencyLevel;
}
