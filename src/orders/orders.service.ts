import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { WebhooksService } from 'src/webhooks/webhooks.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly webhooksService: WebhooksService,
  ) {}

  findAll() {
    return this.prismaService.order.findMany();
  }

  async findOne(id: number) {
    const order = await this.prismaService.order.findUnique({ where: { id } });

    if (!order) {
      throw new NotFoundException('Ordem de compra não encontrada.');
    }

    return order;
  }

  async create(createOrderDto: CreateOrderDto) {
    const orderCreate = await this.prismaService.order.create({
      data: createOrderDto,
    });

    await this.webhooksService.emit({
      orderId: orderCreate.id,
      action: 'created',
    });

    return orderCreate;
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    await this.findOne(id);

    return this.prismaService.order.update({
      select: { id: true },
      where: { id },
      data: updateOrderDto,
    });
  }

  async updateCompleted(id: number) {
    const order = await this.findOne(id);

    if (order?.completed) {
      throw new ConflictException(
        'Ordem de compra já foi marcada como concluida.',
      );
    }

    if (order?.canceled) {
      throw new ConflictException(
        'Ordem de compra já foi marcada como cancelada.',
      );
    }

    const orderUpdate = await this.prismaService.order.update({
      where: { id },
      data: {
        completed: true,
        completedAt: new Date(),
      },
    });

    await this.webhooksService.emit({ orderId: order.id, action: 'completed' });

    return orderUpdate;
  }

  async updateCanceled(id: number) {
    const order = await this.findOne(id);

    if (order?.canceled) {
      throw new ConflictException(
        'Ordem de compra já foi marcada como cancelada.',
      );
    }

    if (order?.completed) {
      throw new ConflictException(
        'Ordem de compra já foi marcada como concluida.',
      );
    }

    const orderUpdate = await this.prismaService.order.update({
      where: { id },
      data: {
        canceled: true,
        canceledAt: new Date(),
      },
    });

    await this.webhooksService.emit({ orderId: order.id, action: 'canceled' });

    return orderUpdate;
  }
}
