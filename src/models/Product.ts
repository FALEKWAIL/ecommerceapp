import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
  id: string;
  name: string;
  category: string;
  price: string;
  original_price?: string;
  sizes: string[];
  out_of_stock_sizes: string[];
  label?: string;
  img_class: string;
  img_url?: string;
  colors: string[];
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: String, required: true, trim: true },
    original_price: { type: String, trim: true },
    sizes: { type: [String], default: [] },
    out_of_stock_sizes: { type: [String], default: [] },
    label: { type: String, trim: true },
    img_class: { type: String, default: 'product-img-1' },
    img_url: { type: String },
    colors: { type: [String], default: [] },
    is_active: { type: Boolean, default: true },
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

export const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;

