import { IsString, IsNotEmpty, IsOptional, IsNumber } from 'class-validator';

export class CreateClassDto {
  @IsString() @IsNotEmpty() name: string;
  @IsString() @IsOptional() description?: string;
  @IsString() @IsOptional() code?: string;
  @IsNumber() teacherId: number;
}

export class UpdateClassDto {
  @IsString() @IsOptional() name?: string;
  @IsString() @IsOptional() description?: string;
  @IsString() @IsOptional() code?: string;
}

export class EnrollStudentDto {
  @IsNumber() studentId: number;
}
