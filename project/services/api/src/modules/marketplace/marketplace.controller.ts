import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req, Headers, RawBody } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { MarketplaceService } from './marketplace.service';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';
import Stripe from 'stripe';
import { config } from '@streamlink/config';

@ApiTags('marketplace')
@Controller('marketplace')
export class MarketplaceController {
  private stripe: Stripe;

  constructor(private marketplaceService: MarketplaceService) {
    this.stripe = new Stripe(config.stripe.secretKey, {
      apiVersion: '2024-06-20',
    });
  }

  // Products
  @Get('products/:streamerId')
  @ApiOperation({ summary: 'Get streamer products' })
  @ApiResponse({ status: 200, description: 'Products retrieved successfully' })
  getProducts(@Param('streamerId') streamerId: string, @Query('active') active?: string) {
    const isActive = active === 'true' ? true : active === 'false' ? false : undefined;
    return this.marketplaceService.getProducts(streamerId, isActive);
  }

  @ApiBearerAuth()
  @Roles('STREAMER', 'BOTH')
  @Post('products')
  @ApiOperation({ summary: 'Create a product' })
  @ApiResponse({ status: 201, description: 'Product created successfully' })
  createProduct(@Req() req, @Body() body: { title: string; description?: string; price: number; currency?: string }) {
    return this.marketplaceService.createProduct(req.user.id, body);
  }

  @ApiBearerAuth()
  @Roles('STREAMER', 'BOTH')
  @Patch('products/:id')
  @ApiOperation({ summary: 'Update a product' })
  @ApiResponse({ status: 200, description: 'Product updated successfully' })
  updateProduct(@Req() req, @Param('id') id: string, @Body() body: { title?: string; description?: string; price?: number; isActive?: boolean }) {
    return this.marketplaceService.updateProduct(req.user.id, id, body);
  }

  @ApiBearerAuth()
  @Roles('STREAMER', 'BOTH')
  @Delete('products/:id')
  @ApiOperation({ summary: 'Delete a product' })
  @ApiResponse({ status: 200, description: 'Product deleted successfully' })
  deleteProduct(@Req() req, @Param('id') id: string) {
    return this.marketplaceService.deleteProduct(req.user.id, id);
  }

  // Orders
  @ApiBearerAuth()
  @Post('orders')
  @ApiOperation({ summary: 'Create an order' })
  @ApiResponse({ status: 201, description: 'Order created successfully' })
  createOrder(@Req() req, @Body() body: { productId: string }) {
    return this.marketplaceService.createOrder(req.user.id, body.productId);
  }

  @ApiBearerAuth()
  @Get('orders')
  @ApiOperation({ summary: 'Get user orders' })
  @ApiResponse({ status: 200, description: 'Orders retrieved successfully' })
  getOrders(@Req() req, @Query('role') role: 'buyer' | 'seller' = 'buyer') {
    return this.marketplaceService.getOrders(req.user.id, role);
  }

  // Webhook
  @Public()
  @Post('webhook')
  @ApiOperation({ summary: 'Stripe webhook endpoint' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully' })
  async handleWebhook(@RawBody() body: Buffer, @Headers('stripe-signature') signature: string) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(body, signature, config.stripe.webhookSecret);
    } catch (err) {
      console.log(`Webhook signature verification failed.`, err.message);
      throw new Error('Invalid signature');
    }

    await this.marketplaceService.handleStripeWebhook(event);
    return { received: true };
  }
}