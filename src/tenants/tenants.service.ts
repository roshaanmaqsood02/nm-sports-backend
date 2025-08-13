import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from 'src/entities/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    // Auto-generate slug if missing
    let slug =
      createTenantDto.slug ||
      createTenantDto.name?.toLowerCase().replace(/\s+/g, '-');

    if (!slug) {
      throw new BadRequestException('Tenant name or slug is required');
    }

    // Check if slug already exists
    const existingTenant = await this.findBySlug(slug);
    if (existingTenant) {
      throw new BadRequestException(
        `Tenant with slug "${slug}" already exists`,
      );
    }

    const tenant = this.tenantRepository.create({
      ...createTenantDto,
      slug,
    });

    return this.tenantRepository.save(tenant);
  }

  async findAll(): Promise<Tenant[]> {
    return this.tenantRepository.find({ relations: ['users'] });
  }

  async findOne(id: string): Promise<Tenant> {
    const tenant = await this.tenantRepository.findOne({
      where: { id },
      relations: ['users'],
    });
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return tenant;
  }

  async update(id: string, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.findOne(id);

    // If updating slug, ensure uniqueness
    if (updateTenantDto.slug) {
      const existingTenant = await this.findBySlug(updateTenantDto.slug);
      if (existingTenant && existingTenant.id !== id) {
        throw new BadRequestException(
          `Tenant with slug "${updateTenantDto.slug}" already exists`,
        );
      }
    }

    Object.assign(tenant, updateTenantDto);
    return this.tenantRepository.save(tenant);
  }

  async remove(id: string): Promise<void> {
    // Check if any users are linked to this tenant
    const users = await this.userRepository.find({ where: { tenantId: id } });

    if (users.length > 0) {
      throw new BadRequestException('Cannot delete tenant with existing users');
    }

    await this.tenantRepository.delete(id);
  }

  async findBySlug(slug: string): Promise<Tenant | null> {
    return this.tenantRepository.findOne({ where: { slug } });
  }
}
