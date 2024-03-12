import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { OrdersModule } from './orders/orders.module';
import { WebhooksModule } from './webhooks/webhooks.module';

@Module({
  imports: [PrismaModule, OrdersModule, WebhooksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
