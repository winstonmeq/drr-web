import { NextRequest, NextResponse } from 'next/server';


// POST handler to forward emergency data to external API
export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request body
    const { email, password } = await request.json();

    console.log('Received data:', { email, password });

    const data2 = {email, password};

   // Validate request body
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Forward the request to the external API
    const externalResponse = await fetch(
      `${process.env.NEXT_PUBLIC_DOMAIN}/api/webuser`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data2),
      })

    // Check if the external API request was successful
    if (!externalResponse.ok) {
      const errorText = await externalResponse.text();
      console.error('External API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to login to external API', details: errorText },
        { status: externalResponse.status }
      );
    }

    // Get the response from external API
    const responseData = await externalResponse.json();

    // Return success response with data from external API
    return NextResponse.json(
      {
        message: 'successfully logging in',
        data: responseData,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error forwarding emergency data:', error);
    return NextResponse.json(
      { error: 'Internal server error while forwarding emergency data' },
      { status: 500 }
    );
  }
}