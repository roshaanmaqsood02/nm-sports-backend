import {
  Body,
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { UserService } from 'src/users/users.service';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UserService,
  ) {}

  // Register route
  @Post('users/register')
  async register(@Body() createUserDto: CreateUserDto) {
    console.log('Register endpoint hit!', createUserDto);
    return this.authService.register(createUserDto);
  }

  // Login route
  @UseGuards(AuthGuard('local'))
  @Post('users/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // Get all users
  @Get('users')
  async findAllUsers() {
    return this.usersService.findAll();
  }

  // ME
  @UseGuards(AuthGuard('jwt'))
  @Get('users/me')
  async getProfile(@Request() req) {
    return req.user;
  }

  // Update a user
  @Put('users/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  // Delete a user
  @Delete('users/:id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
