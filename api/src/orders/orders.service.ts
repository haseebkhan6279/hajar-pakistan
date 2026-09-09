import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument, toAdminOrder } from './order.schema';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { ORDER_PREFIX } from '../common/brand';

/**
 * Shipping is not quoted at checkout. Per the published shipping policy,
 * charges vary by destination, package size and courier and are confirmed
 * before the order is — so an incoming order carries no shipping figure, and
 * the team sets it when they confirm.
 */
const SHIPPING_TO_BE_CONFIRMED = 0;

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  private async nextOrderNumber() {
    const count = await this.orderModel.countDocuments().exec();
    return `${ORDER_PREFIX}-${String(count + 1).padStart(5, '0')}`;
  }

  async create(dto: CreateOrderDto) {
    const subtotal = dto.items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0,
    );
    const shipping = SHIPPING_TO_BE_CONFIRMED;
    const total = subtotal + shipping;
    const orderNumber = await this.nextOrderNumber();

    const doc = await this.orderModel.create({
      orderNumber,
      customer: {
        fullName: dto.customer.fullName.trim(),
        phone: dto.customer.phone.trim(),
        email: (dto.customer.email ?? '').trim().toLowerCase(),
        address: dto.customer.address.trim(),
        city: dto.customer.city.trim(),
        province: dto.customer.province.trim(),
        postalCode: (dto.customer.postalCode ?? '').trim(),
        country: dto.customer.country?.trim() || 'Pakistan',
        notes: (dto.customer.notes ?? '').trim(),
      },
      items: dto.items.map((item) => ({
        productId: item.productId,
        name: item.name,
        slug: item.slug,
        price: item.price,
        qty: item.qty,
        size: item.size ?? '',
        color: item.color ?? '',
        image: item.image ?? '',
      })),
      paymentMethod: 'pending',
      status: 'pending',
      subtotal,
      shipping,
      total,
    });

    return toAdminOrder(doc);
  }

  async findAll(status?: string) {
    const filter: Record<string, unknown> = {};
    if (status) filter.status = status;
    const docs = await this.orderModel
      .find(filter)
      .sort({ createdAt: -1 })
      .exec();
    return docs.map(toAdminOrder);
  }

  async findOne(id: string) {
    const doc = await this.orderModel.findById(id).exec();
    if (!doc) throw new NotFoundException('Order not found');
    return toAdminOrder(doc);
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const doc = await this.orderModel
      .findByIdAndUpdate(id, { status: dto.status }, { new: true })
      .exec();
    if (!doc) throw new NotFoundException('Order not found');
    return toAdminOrder(doc);
  }
}
