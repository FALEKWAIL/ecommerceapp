import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Product } from '@/models/Product';

const DEFAULT_PRODUCTS = [
  {
    name: "Washed Canvas Overshirt",
    category: "OUTERWEAR",
    price: "$89.00",
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    label: "NEW",
    img_class: "product-img-1",
    colors: ['Olive', 'Noir', 'Ecru'],
    is_active: true
  },
  {
    name: "Oversized Cargo Tee",
    category: "TOPS",
    price: "$49.00",
    original_price: "$69.00",
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    out_of_stock_sizes: ['XXL'],
    label: "SALE",
    img_class: "product-img-2",
    colors: ['Sable', 'Noir', 'Kaki'],
    is_active: true
  },
  {
    name: "Relaxed Cargo Trousers",
    category: "BOTTOMS",
    price: "$79.00",
    sizes: ['28', '30', '32', '34', '36'],
    label: "NEW",
    img_class: "product-img-3",
    colors: ['Noir', 'Khaki', 'Sauge'],
    is_active: true
  },
  {
    name: "Heavyweight Crew Sweat",
    category: "KNITWEAR",
    price: "$95.00",
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    img_class: "product-img-4",
    colors: ['Gris', 'Noir', 'Ecru'],
    is_active: true
  },
  {
    name: "Urban Bomber Jacket",
    category: "OUTERWEAR",
    price: "$120.00",
    sizes: ['S', 'M', 'L', 'XL'],
    label: "NEW",
    img_class: "product-img-5",
    colors: ['Noir', 'Bleu Marine', 'Olive'],
    is_active: true
  },
  {
    name: "Classic Slim Chinos",
    category: "BOTTOMS",
    price: "$65.00",
    sizes: ['30', '32', '34', '36'],
    img_class: "product-img-6",
    colors: ['Khaki', 'Bleu Marine', 'Sable'],
    is_active: true
  },
  {
    name: "Knitted Linen Polo",
    category: "TOPS",
    price: "$55.00",
    sizes: ['S', 'M', 'L', 'XL'],
    img_class: "product-img-7",
    colors: ['Sable', 'Ecru', 'Noir'],
    is_active: true
  },
  {
    name: "Minimalist Leather Sneakers",
    category: "SHOES",
    price: "$110.00",
    sizes: ['40', '41', '42', '43', '44'],
    label: "NEW",
    img_class: "product-img-8",
    colors: ['Blanc', 'Noir'],
    is_active: true
  }
];

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const includeInactive = searchParams.get('all') === 'true';

    const filter = includeInactive ? {} : { is_active: true };
    let products = await Product.find(filter).sort({ created_at: -1 });

    // Auto-seed if database is completely empty
    if (products.length === 0) {
      const count = await Product.countDocuments();
      if (count === 0) {
        await Product.insertMany(DEFAULT_PRODUCTS);
        products = await Product.find(filter).sort({ created_at: -1 });
      }
    }

    return NextResponse.json({ success: true, data: products });
  } catch (error: any) {
    console.warn('MongoDB connection fallback to default products:', error.message);
    // Graceful fallback to default catalog if MongoDB is not running yet
    return NextResponse.json({
      success: true,
      data: DEFAULT_PRODUCTS.map((p, idx) => ({ ...p, id: `mock-${idx + 1}` })),
      offline: true,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.name || !body.price) {
      return NextResponse.json(
        { success: false, error: 'Name and price are required' },
        { status: 400 }
      );
    }

    const product = await Product.create(body);
    return NextResponse.json({ success: true, data: product }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create product' },
      { status: 500 }
    );
  }
}

