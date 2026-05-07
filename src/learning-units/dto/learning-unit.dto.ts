import { IsString, IsNotEmpty, IsOptional, IsNumber, IsEnum, IsInt, Min } from 'class-validator';
import { ContentType, DifficultyLevel } from '../entities/learning-unit.entity';
export class CreateLearningUnitDto {
  @IsString() @IsNotEmpty() title: string;
  @IsString() @IsOptional() content?: string;
  @IsEnum(ContentType) @IsOptional() contentType?: ContentType;
  @IsEnum(DifficultyLevel) @IsOptional() difficulty?: DifficultyLevel;
  @IsInt() @Min(0) @IsOptional() order?: number;
  @IsInt() @IsOptional() estimatedMinutes?: number;
  @IsNumber() topicId: number;
}
export class UpdateLearningUnitDto {
  @IsString() @IsOptional() title?: string;
  @IsString() @IsOptional() content?: string;
  @IsEnum(ContentType) @IsOptional() contentType?: ContentType;
  @IsEnum(DifficultyLevel) @IsOptional() difficulty?: DifficultyLevel;
  @IsInt() @Min(0) @IsOptional() order?: number;
  @IsInt() @IsOptional() estimatedMinutes?: number;
}
