import { Controller, Post, Body, BadRequestException, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { UserRole } from '@/entities';

@ApiTags('Auth')
@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  async register(
    @Body()
    body: {
      name: string;
      email: string;
      password: string;
      role: 'merchant' | 'affiliate';
    },
  ) {
    if (!body.name || !body.email || !body.password || !body.role) {
      throw new BadRequestException('Missing required fields');
    }

    const role = body.role === 'merchant' ? UserRole.MERCHANT : UserRole.AFFILIATE;

    return this.authService.register(body.name, body.email, body.password, role);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  async login(
    @Body()
    body: {
      email: string;
      password: string;
    },
  ) {
    if (!body.email || !body.password) {
      throw new BadRequestException('Email and password are required');
    }

    return this.authService.login(body.email, body.password);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  async refresh(
    @Body()
    body: {
      refreshToken: string;
    },
  ) {
    if (!body.refreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    return this.authService.refresh(body.refreshToken);
  }

  @Post('verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify current user' })
  async verify(@Request() req) {
    const user = await this.authService.validateUser(req.user.sub);
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      verified: user.verified,
    };
  }
}

