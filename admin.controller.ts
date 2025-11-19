import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  Request,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Admin')
@Controller('api/v1/admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  /**
   * Verify admin access
   */
  private async verifyAdmin(userId: number) {
    await this.adminService.verifyAdmin(userId);
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get system statistics (admin only)' })
  async getSystemStats(@Request() req) {
    await this.verifyAdmin(req.user.sub);
    return this.adminService.getSystemStats();
  }

  @Get('users')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users (admin only)' })
  async getAllUsers(
    @Request() req,
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    await this.verifyAdmin(req.user.sub);
    return this.adminService.getAllUsers(limit, offset);
  }

  @Get('merchants')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all merchants (admin only)' })
  async getAllMerchants(
    @Request() req,
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    await this.verifyAdmin(req.user.sub);
    return this.adminService.getAllMerchants(limit, offset);
  }

  @Get('affiliates')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all affiliates (admin only)' })
  async getAllAffiliates(
    @Request() req,
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    await this.verifyAdmin(req.user.sub);
    return this.adminService.getAllAffiliates(limit, offset);
  }

  @Post('users/:userId/suspend')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Suspend user (admin only)' })
  async suspendUser(@Request() req, @Param('userId') userId: number) {
    await this.verifyAdmin(req.user.sub);
    await this.adminService.suspendUser(userId);
    return { message: 'User suspended successfully' };
  }

  @Post('users/:userId/activate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate user (admin only)' })
  async activateUser(@Request() req, @Param('userId') userId: number) {
    await this.verifyAdmin(req.user.sub);
    await this.adminService.activateUser(userId);
    return { message: 'User activated successfully' };
  }

  @Post('merchants/:merchantId/suspend')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Suspend merchant (admin only)' })
  async suspendMerchant(@Request() req, @Param('merchantId') merchantId: number) {
    await this.verifyAdmin(req.user.sub);
    await this.adminService.suspendMerchant(merchantId);
    return { message: 'Merchant suspended successfully' };
  }

  @Post('merchants/:merchantId/activate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate merchant (admin only)' })
  async activateMerchant(@Request() req, @Param('merchantId') merchantId: number) {
    await this.verifyAdmin(req.user.sub);
    await this.adminService.activateMerchant(merchantId);
    return { message: 'Merchant activated successfully' };
  }

  @Post('affiliates/:affiliateId/suspend')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Suspend affiliate (admin only)' })
  async suspendAffiliate(@Request() req, @Param('affiliateId') affiliateId: number) {
    await this.verifyAdmin(req.user.sub);
    await this.adminService.suspendAffiliate(affiliateId);
    return { message: 'Affiliate suspended successfully' };
  }

  @Post('affiliates/:affiliateId/activate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Activate affiliate (admin only)' })
  async activateAffiliate(@Request() req, @Param('affiliateId') affiliateId: number) {
    await this.verifyAdmin(req.user.sub);
    await this.adminService.activateAffiliate(affiliateId);
    return { message: 'Affiliate activated successfully' };
  }

  @Get('fraud-logs')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get fraud logs (admin only)' })
  async getFraudLogs(
    @Request() req,
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    await this.verifyAdmin(req.user.sub);
    return this.adminService.getFraudLogs(limit, offset);
  }

  @Post('fraud-logs/:logId/resolve')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Resolve fraud log (admin only)' })
  async resolveFraudLog(@Request() req, @Param('logId') logId: number) {
    await this.verifyAdmin(req.user.sub);
    await this.adminService.resolveFraudLog(logId);
    return { message: 'Fraud log resolved successfully' };
  }

  @Get('conversions/pending')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get pending conversions for review (admin only)' })
  async getPendingConversions(
    @Request() req,
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    await this.verifyAdmin(req.user.sub);
    return this.adminService.getPendingConversions(limit, offset);
  }
}

