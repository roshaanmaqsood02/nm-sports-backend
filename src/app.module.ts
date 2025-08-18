import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import {ConfigModule, ConfigService} from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TenantModule } from './tenants/tenants.module';
import { User } from './entities/user.entity';
import { Tenant } from './entities/tenant.entity';
import { PlayersModule } from './players/players.module';
import { Player } from './entities/player.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [User, Tenant, Player],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    AuthModule, UsersModule, TenantModule, PlayersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
