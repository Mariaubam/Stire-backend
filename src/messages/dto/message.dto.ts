import { IsNumber, IsString, IsNotEmpty, IsOptional } from 'class-validator';
export class CreateMessageDto {
  @IsNumber() @IsOptional() senderId?: number;
  @IsNumber() receiverId: number;
  @IsString() @IsNotEmpty() content: string;
}
