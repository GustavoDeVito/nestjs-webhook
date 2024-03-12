import { IsUrl } from 'class-validator';

export class CreateWebhookDto {
  @IsUrl()
  url: string;
}
