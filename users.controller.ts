import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Users')
@Controller('api/v1/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current user profile' })
  async getCurrentUser(@Request() req) {
    const user = await this.usersService.findById(req.user.sub);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      verified: user.verified,
      createdAt: user.created_at,
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  async getUserById(@Param('id') id: number) {
    const user = await this.usersService.findById(id);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      verified: user.verified,
      createdAt: user.created_at,
    };
  }
}

