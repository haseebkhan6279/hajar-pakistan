import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ _id: false })
export class OrderCustomer {
  @Prop({ required: true })
  fullName: string;

  @Prop({ required: true })
  phone: string;

  @Prop({ default: '' })
  email: string;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  city: string;

  @Prop({ required: true })
  province: string;

  @Prop({ default: '' })
  postalCode: string;

  @Prop({ default: 'Pakistan' })
  country: string;

  @Prop({ default: '' })
  notes: string;
}

@Schema({ _id: false })
export class OrderItem {
  @Prop({ required: true })
  productId: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  slug: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  qty: number;

  @Prop({ default: '' })
  size: string;

  @Prop({ default: '' })
  color: string;

  @Prop({ default: '' })
  image: string;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  orderNumber: string;

  @Prop({ type: OrderCustomer, required: true })
  customer: OrderCustomer;

  @Prop({ type: [OrderItem], default: [] })
  items: OrderItem[];

  /**
   * Payment is arranged after the team confirms the order — see the published
   * payment policy (50% advance on made-to-order). Set this to the method
   * actually used once it is agreed.
   */
  @Prop({ default: 'pending' })
  paymentMethod: string;

  @Prop({
    default: 'pending',
    enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
  })
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';

  @Prop({ required: true })
  subtotal: number;

  @Prop({ default: 0 })
  shipping: number;

  @Prop({ required: true })
  total: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

export function toAdminOrder(doc: OrderDocument) {
  const o = doc.toObject() as Order & {
    _id: { toString(): string };
    createdAt?: Date;
    updatedAt?: Date;
  };
  return {
    id: String(o._id),
    orderNumber: o.orderNumber,
    customer: o.customer,
    items: o.items,
    paymentMethod: o.paymentMethod,
    status: o.status,
    subtotal: o.subtotal,
    shipping: o.shipping,
    total: o.total,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
  };
}
