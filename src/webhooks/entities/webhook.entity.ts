import { Webhook } from '@prisma/client';

export class WebhookEntity implements Webhook {
  id: number;
  url: string;
  status: boolean;
}
