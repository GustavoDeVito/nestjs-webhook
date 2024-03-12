import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateWebhookDto } from './dto/create-webhook.dto';
import { UpdateWebhookDto } from './dto/update-webhook.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class WebhooksService {
  constructor(
    private prismaService: PrismaService,
    private readonly httpService: HttpService,
  ) {}

  findAll() {
    return this.prismaService.webhook.findMany();
  }

  async findOne(id: number) {
    const webhook = await this.prismaService.webhook.findUnique({
      where: { id },
    });

    if (!webhook) {
      throw new NotFoundException('Webhook não encontrado.');
    }

    return webhook;
  }

  async create(createWebhookDto: CreateWebhookDto) {
    await this.prismaService.webhook.create({ data: createWebhookDto });
  }

  async update(id: number, updateWebhookDto: UpdateWebhookDto) {
    await this.findOne(id);

    return this.prismaService.webhook.update({
      where: { id },
      data: updateWebhookDto,
    });
  }

  async emit(data: {
    orderId: number;
    action: 'created' | 'completed' | 'canceled';
  }) {
    const webhooks = await this.prismaService.webhook.findMany({
      where: { status: true },
    });

    for (const webhook of webhooks) {
      this.httpService.post(webhook.url, data).subscribe({
        complete: () => {
          console.log('Send');
        },
        error: (err) => {
          console.log('Error', err);
        },
      });
    }
  }
}
