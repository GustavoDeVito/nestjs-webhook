import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Put,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll() {
    return this.ordersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.ordersService.findOne(+id);
  }

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.create(createOrderDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    return this.ordersService.update(+id, updateOrderDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Put('completed/:id')
  updateCompleted(@Param('id', ParseIntPipe) id: string) {
    return this.ordersService.updateCompleted(+id);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Put('canceled/:id')
  updateCanceled(@Param('id', ParseIntPipe) id: string) {
    return this.ordersService.updateCanceled(+id);
  }
}
