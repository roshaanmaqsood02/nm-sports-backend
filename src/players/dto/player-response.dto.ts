import { ApiProperty } from '@nestjs/swagger';
import { Player } from 'src/entities/player.entity';

export class PlayerResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty({ required: false })
  dateOfBirth?: Date;

  @ApiProperty({ required: false })
  position?: string;

  @ApiProperty({ required: false })
  jerseyNumber?: number;

  @ApiProperty({ required: false })
  nationality?: string;

  @ApiProperty({ required: false })
  height?: number;

  @ApiProperty({ required: false })
  weight?: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(player: Player) {
    this.id = player.id;
    this.firstName = player.firstName;
    this.lastName = player.lastName;
    this.dateOfBirth = player.dateOfBirth;
    this.position = player.position;
    this.jerseyNumber = player.jerseyNumber;
    this.nationality = player.nationality;
    this.height = player.height;
    this.weight = player.weight;
    this.isActive = player.isActive;
    this.createdAt = player.createdAt;
    this.updatedAt = player.updatedAt;
  }
}