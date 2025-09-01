import { NextRequest, NextResponse } from 'next/server';
import { getUrl } from '@/lib/urlStore';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    // Validate that code is provided
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid short code',
        },
        { status: 400 }
      );
    }

    // Look up the original URL
    const originalUrl = getUrl(code);

    if (!originalUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'Short URL not found',
          message: 'This short URL does not exist or has expired',
        },
        { status: 404 }
      );
    }

    // Redirect to the original URL
    return NextResponse.redirect(originalUrl, 301);
  } catch (error) {
    console.error('Error redirecting URL:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}