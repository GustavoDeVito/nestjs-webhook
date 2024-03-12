import { Order } from '@prisma/client';

export class OrderEntity implements Order {
  id: number;
  description: string;
  completed: boolean;
  completedAt: Date;
  canceled: boolean;
  canceledAt: Date;
}
