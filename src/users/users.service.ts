import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Tenant } from '../entities/tenant.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  async create(data: Partial<User>): Promise<User> {
    if (data.tenantId) {
      const tenant = await this.tenantRepository.findOne({
        where: { id: data.tenantId },
      });
      if (!tenant) {
        throw new NotFoundException('Tenant not found');
      }
    }

    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['tenant'] });
  }

  async findByTenant(tenantId: string): Promise<User[]> {
    return this.userRepository.find({
      where: { tenantId },
      relations: ['tenant'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['tenant'],
    });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['tenant'],
    });
  }
  
  async findByIdWithTenant(userId: string) {
  return this.userRepository.findOne({
    where: { id: userId },
    relations: ['tenant'], 
  });
}

  async update(id: string, data: Partial<User>): Promise<User> {
    const user = await this.findOne(id);

    if (data.tenantId) {
      const tenant = await this.tenantRepository.findOne({
        where: { id: data.tenantId },
      });
      if (!tenant) {
        throw new NotFoundException('Tenant not found');
      }
    }

    Object.assign(user, data);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
