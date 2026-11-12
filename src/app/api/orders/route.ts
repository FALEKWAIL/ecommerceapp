import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/models/Order';

export async function GET() {
  try {
    await connectToDatabase();
    const orders = await Order.find({}).sort({ created_at: -1 });
    return NextResponse.json({ success: true, data: orders });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();

    if (!body.customer_name || !body.customer_phone || !body.customer_wilaya) {
      return NextResponse.json(
        { success: false, error: 'Name, phone number, and wilaya are required' },
        { status: 400 }
      );
    }

    const order = await Order.create({
      customer_name: body.customer_name,
      customer_phone: body.customer_phone,
      customer_wilaya: body.customer_wilaya,
      size: body.size,
      color: body.color,
      product_name: body.product_name,
      product_price: body.product_price,
      is_cart_order: Boolean(body.is_cart_order),
      cart_items: body.cart_items || [],
      status: 'Pending',
    });

    return NextResponse.json({ success: true, data: order }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}

