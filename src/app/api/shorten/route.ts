import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { addUrl } from '@/lib/urlStore';

// Validation schema for the request body
const shortenSchema = z.object({
  url: z.string().url('Please enter a valid URL'),
});

export async function POST(request: NextRequest) {
  try {
    // Parse and validate the request body
    const body = await request.json();
    const { url } = shortenSchema.parse(body);

    // Generate short code and store the URL
    const shortCode = addUrl(url);

    // Build the short URL (use environment variable or default to localhost for development)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const shortUrl = `${baseUrl}/s/${shortCode}`;

    // Return the shortened URL
    return NextResponse.json({
      success: true,
      shortUrl,
      shortCode,
      originalUrl: url,
    });
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request',
          details: error.errors[0]?.message || 'Invalid URL format',
        },
        { status: 400 }
      );
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid JSON in request body',
        },
        { status: 400 }
      );
    }

    // Handle other errors
    console.error('Error shortening URL:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}