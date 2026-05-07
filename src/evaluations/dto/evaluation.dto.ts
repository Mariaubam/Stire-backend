import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, IsArray } from 'class-validator';
import { EvaluationType } from '../entities/evaluation.entity';
export class CreateEvaluationDto {
  @IsString() @IsNotEmpty() title: string;
  @IsEnum(EvaluationType) @IsOptional() type?: EvaluationType;
  @IsNumber() @IsOptional() maxScore?: number;
  @IsArray() @IsOptional() questions?: any[];
  @IsNumber() learningUnitId: number;
}
export class UpdateEvaluationDto {
  @IsString() @IsOptional() title?: string;
  @IsEnum(EvaluationType) @IsOptional() type?: EvaluationType;
  @IsNumber() @IsOptional() maxScore?: number;
  @IsArray() @IsOptional() questions?: any[];
}
