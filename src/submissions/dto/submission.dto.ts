import { IsNumber, IsOptional, IsArray } from 'class-validator';
export class CreateSubmissionDto {
  @IsNumber() studentId: number;
  @IsNumber() evaluationId: number;
  @IsArray() @IsOptional() answers?: any[];
  @IsNumber() @IsOptional() score?: number;
}
