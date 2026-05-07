import { Controller, Get, Post, Param, Body, UseGuards, ParseIntPipe, Patch, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('Mensajes')
@ApiBearerAuth('JWT')
@Controller('messages')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MessagesController {
  constructor(private readonly msgsService: MessagesService) {}

  // Cualquier usuario autenticado puede enviar mensajes, pero solo en su nombre
  @Post()
  create(
    @Body() dto: CreateMessageDto,
    @CurrentUser() currentUser: { id: number; role: UserRole },
  ) {
    dto.senderId = currentUser.id;
    return this.msgsService.create(dto);
  }

  // Solo puedes ver conversaciones en las que participas
  @Get('conversation/:userA/:userB')
  getConversation(
    @Param('userA', ParseIntPipe) a: number,
    @Param('userB', ParseIntPipe) b: number,
    @CurrentUser() currentUser: { id: number; role: UserRole },
  ) {
    if (currentUser.role !== UserRole.ADMIN && currentUser.id !== a && currentUser.id !== b) {
      throw new ForbiddenException('Solo puedes ver conversaciones en las que participas');
    }
    return this.msgsService.getConversation(a, b);
  }

  // Solo puedes ver tu propio inbox
  @Get('inbox/:userId')
  getInbox(
    @Param('userId', ParseIntPipe) id: number,
    @CurrentUser() currentUser: { id: number; role: UserRole },
  ) {
    if (currentUser.role !== UserRole.ADMIN && currentUser.id !== id) {
      throw new ForbiddenException('Solo puedes ver tu propio inbox');
    }
    return this.msgsService.getInbox(id);
  }

  // Solo el receptor puede marcar como leído
  @Patch(':id/read')
  markAsRead(@Param('id', ParseIntPipe) id: number) {
    return this.msgsService.markAsRead(id);
  }
}
