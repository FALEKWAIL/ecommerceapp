import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import { Admin } from '@/models/Admin';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const adminEmail = (process.env.ADMIN_EMAIL || 'digitalbuildersalgeria@gmail.com').toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || process.env.admin_password || 'd2026d2026';

    let isAuthenticated = false;
    let adminRecord = null;

    try {
      await connectToDatabase();
      adminRecord = await Admin.findOne({ email: email.toLowerCase() });

      if (adminRecord) {
        isAuthenticated = await bcrypt.compare(password, adminRecord.password);
      } else if (email.toLowerCase() === adminEmail) {
        // First login: check env password and create Admin in MongoDB
        if (password === adminPassword) {
          isAuthenticated = true;
          const hashedPassword = await bcrypt.hash(password, 10);
          adminRecord = await Admin.create({
            email: adminEmail,
            password: hashedPassword,
            name: 'Store Administrator',
            role: 'admin',
          });
        }
      }
    } catch (dbErr: any) {
      console.warn('DB login fallback to env check:', dbErr.message);
      // Fallback to env variables if DB is unavailable
      if (email.toLowerCase() === adminEmail && password === adminPassword) {
        isAuthenticated = true;
      }
    }

    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = signToken({
      email: email.toLowerCase(),
      role: 'admin',
    });

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        email: email.toLowerCase(),
        name: adminRecord?.name || 'Administrator',
        role: 'admin',
      },
    });

    // Set HTTP-only cookie for secure browser sessions
    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Login failed' },
      { status: 500 }
    );
  }
}

