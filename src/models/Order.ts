import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICartItem {
  name: string;
  size: string;
  qty: number;
  price?: string;
}

export interface IOrder extends Document {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_wilaya: string;
  size?: string;
  color?: string;
  product_name?: string | null;
  product_price?: string | null;
  is_cart_order: boolean;
  cart_items: ICartItem[];
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
  created_at: Date;
  updated_at: Date;
}

const CartItemSchema = new Schema<ICartItem>(
  {
    name: { type: String, required: true },
    size: { type: String, required: true },
    qty: { type: Number, required: true },
    price: { type: String },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    customer_name: { type: String, required: true, trim: true },
    customer_phone: { type: String, required: true, trim: true },
    customer_wilaya: { type: String, required: true, trim: true },
    size: { type: String },
    color: { type: String },
    product_name: { type: String, default: null },
    product_price: { type: String, default: null },
    is_cart_order: { type: Boolean, default: false },
    cart_items: { type: [CartItemSchema], default: [] },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
      virtuals: true,
      transform: (_, ret: any) => {
        ret.id = ret._id.toString();
        delete ret.__v;
        return ret;
      },
    },
  }
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
