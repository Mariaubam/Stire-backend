import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: any) {
    // El rol siempre es student al registrarse; solo el admin puede cambiar roles
    const user = await this.usersService.create({ ...dto, role: UserRole.STUDENT });
    const { password, ...result } = user;
    return { user: result, token: this.generateToken(user.id, user.email, user.role) };
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');

    const { password: _, ...result } = user;
    return { user: result, token: this.generateToken(user.id, user.email, user.role) };
  }

  async seed() {
    const usuarios = [
      { fullName: 'Admin Principal', email: 'admin@stire.com', password: 'Admin123!', role: UserRole.ADMIN },
      { fullName: 'Profesora Maria', email: 'maria@stire.com', password: 'Maria123!', role: UserRole.TEACHER },
      { fullName: 'Estudiante Juan', email: 'juan@stire.com', password: 'Juan123!', role: UserRole.STUDENT, semestre: '3', programa: 'Ingenieria de Sistemas' },
    ];

    const creados: string[] = [];
    const omitidos: string[] = [];

    for (const u of usuarios) {
      try {
        const existe = await this.usersService.findByEmail(u.email).catch(() => null);
        if (existe) { omitidos.push(u.email); continue; }
        await this.usersService.create(u);
        creados.push(u.email);
      } catch {
        omitidos.push(u.email);
      }
    }

    return { message: 'Seed completado', creados, omitidos };
  }

  private generateToken(userId: number, email: string, role: string) {
    return this.jwtService.sign({ sub: userId, email, role });
  }
}
