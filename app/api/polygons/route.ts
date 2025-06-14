import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/polygons`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Add 'Authorization': 'Bearer YOUR_TOKEN' if required
      },
      cache: 'no-store', // Ensure fresh data
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch postnotify data: HTTP ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);

  } catch (error) {
    console.error('Error fetching postnotify data:');
    return NextResponse.json(
      { error: `Server error ${error}` },
      { status: 500 }
    );
  }
}