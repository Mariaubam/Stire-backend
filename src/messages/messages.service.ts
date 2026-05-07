import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Or, Equal } from 'typeorm';
import { Message } from './entities/message.entity';
import { CreateMessageDto } from './dto/message.dto';

@Injectable()
export class MessagesService {
  constructor(@InjectRepository(Message) private readonly msgRepo: Repository<Message>) {}

  async create(dto: CreateMessageDto): Promise<Message> {
    return this.msgRepo.save(this.msgRepo.create(dto));
  }

  async getConversation(userAId: number, userBId: number): Promise<Message[]> {
    return this.msgRepo.find({
      where: [
        { senderId: userAId, receiverId: userBId },
        { senderId: userBId, receiverId: userAId },
      ],
      order: { createdAt: 'ASC' },
      relations: ['sender', 'receiver'],
    });
  }

  async getInbox(userId: number): Promise<Message[]> {
    return this.msgRepo.find({
      where: { receiverId: userId, isRead: false },
      relations: ['sender'],
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: number): Promise<Message> {
    const msg = await this.msgRepo.findOne({ where: { id } });
    if (!msg) throw new NotFoundException(`Mensaje #${id} no encontrado`);
    msg.isRead = true;
    return this.msgRepo.save(msg);
  }
}
