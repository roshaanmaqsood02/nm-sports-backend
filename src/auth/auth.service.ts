import * as bcrypt from 'bcryptjs';
import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { UserService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { TenantsService } from 'src/tenants/tenants.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tenantService: TenantsService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: CreateUserDto) {
    const existingUser = await this.userService.findByEmail(dto.email);
    if (existingUser) {
      throw new UnauthorizedException('Email already registered');
    }

    let tenantId = dto.tenantId;
    if (!tenantId && dto.tenantName) {
      const tenant = await this.tenantService.create({
        name: dto.tenantName,
        slug: dto.slug || dto.tenantName.toLowerCase().replace(/\s+/g, '-'),
      });
      tenantId = tenant.id;
    }

    if (!tenantId) {
      throw new BadRequestException('Tenant information is required');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.userService.create({
      email: dto.email,
      password: hashedPassword,
      name: dto.name,
      tenantId: tenantId,
    });

    const payload = {
      sub: user.id,
      userId: user.id,
      email: user.email,
      tenantId: user.tenantId,
      roles: user.roles,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }

  async validateUser(email: string, pass: string) {
    const user = await this.userService.findByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      tenantId: user.tenantId,
      roles: user.roles,
    };

    const fullUser = await this.userService.findByIdWithTenant(user.id);

    return {
      access_token: this.jwtService.sign(payload),
      user: fullUser,
    };
  }
}
