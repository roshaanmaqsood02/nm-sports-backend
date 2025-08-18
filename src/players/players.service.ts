import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import { Player } from 'src/entities/player.entity';

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  async create(tenantId: string, createPlayerDto: CreatePlayerDto): Promise<Player> {
    const player = this.playerRepository.create({
      ...createPlayerDto,
      tenant: { id: tenantId },
    });
    return this.playerRepository.save(player);
  }

  async findAll(tenantId: string): Promise<Player[]> {
    return this.playerRepository.find({
      where: { tenant: { id: tenantId } },
      order: { lastName: 'ASC', firstName: 'ASC' },
    });
  }

  async findOne(tenantId: string, id: string): Promise<Player> {
    const player = await this.playerRepository.findOne({
      where: { id, tenant: { id: tenantId } },
    });
    
    if (!player) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }
    return player;
  }

  async update(
    tenantId: string,
    id: string,
    updatePlayerDto: UpdatePlayerDto,
  ): Promise<Player> {
    const player = await this.findOne(tenantId, id);
    const updated = this.playerRepository.merge(player, updatePlayerDto);
    return this.playerRepository.save(updated);
  }

  async remove(tenantId: string, id: string): Promise<void> {
    const result = await this.playerRepository.delete({ id, tenant: { id: tenantId } });
    if (result.affected === 0) {
      throw new NotFoundException(`Player with ID ${id} not found`);
    }
  }

  async countActivePlayers(tenantId: string): Promise<number> {
    return this.playerRepository.count({
      where: {
        tenant: { id: tenantId },
        isActive: true,
      },
    });
  }
}