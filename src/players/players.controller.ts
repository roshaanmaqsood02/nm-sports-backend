import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create-player.dto';
import { UpdatePlayerDto } from './dto/update-player.dto';
import type { TenantAwareRequest } from '../common/tenant-aware-request.interface';
import { PlayerResponseDto } from './dto/player-response.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';

@ApiTags('Players')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('players')
export class PlayersController {
  constructor(private readonly playersService: PlayersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new player' })
  async create(
    @Req() req: TenantAwareRequest,
    @Body() createPlayerDto: CreatePlayerDto,
  ): Promise<PlayerResponseDto> {
    const player = await this.playersService.create(
      req.user.tenantId,
      createPlayerDto,
    );
    return new PlayerResponseDto(player);
  }

  @Get()
  @ApiOperation({ summary: 'Get all players for current tenant' })
  async findAll(
    @Req() req: TenantAwareRequest,
  ): Promise<PlayerResponseDto[]> {
    const players = await this.playersService.findAll(req.user.tenantId);
    return players.map(player => new PlayerResponseDto(player));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a player by ID' })
  async findOne(
    @Req() req: TenantAwareRequest,
    @Param('id') id: string,
  ): Promise<PlayerResponseDto> {
    const player = await this.playersService.findOne(req.user.tenantId, id);
    return new PlayerResponseDto(player);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a player' })
  async update(
    @Req() req: TenantAwareRequest,
    @Param('id') id: string,
    @Body() updatePlayerDto: UpdatePlayerDto,
  ): Promise<PlayerResponseDto> {
    const player = await this.playersService.update(
      req.user.tenantId,
      id,
      updatePlayerDto,
    );
    return new PlayerResponseDto(player);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a player' })
  async remove(
    @Req() req: TenantAwareRequest,
    @Param('id') id: string,
  ): Promise<void> {
    await this.playersService.remove(req.user.tenantId, id);
  }

  @Get('metrics/active-count')
  @ApiOperation({ summary: 'Get count of active players' })
  async countActivePlayers(
    @Req() req: TenantAwareRequest,
  ): Promise<{ count: number }> {
    const count = await this.playersService.countActivePlayers(req.user.tenantId);
    return { count };
  }
}