import { IsString, IsNotEmpty, IsOptional, IsNumber, IsInt, Min } from 'class-validator';
export class CreateTopicDto {
  @IsString() @IsNotEmpty() title: string;
  @IsString() @IsOptional() description?: string;
  @IsInt() @Min(0) @IsOptional() order?: number;
  @IsNumber() classId: number;
}
export class UpdateTopicDto {
  @IsString() @IsOptional() title?: string;
  @IsString() @IsOptional() description?: string;
  @IsInt() @Min(0) @IsOptional() order?: number;
}
