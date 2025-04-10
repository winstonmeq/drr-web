import { NextRequest, NextResponse } from 'next/server';

// Define the EmergencyData interface to match your form data
interface EmergencyData {
  emergency: string;
  lat: string;
  long: string;
  mobile: string;
  purok: string;
  barangay: string;
  name: string;
  position: string;
  photoURL: string;
  situation: string;
  munName: string;
  status: boolean;
  verified: boolean;
  createdAt: string;
}

// POST handler to forward emergency data to external API
export async function POST(request: NextRequest) {
  try {
    // Parse the incoming request body
    const data: EmergencyData = await request.json();

    // Validate required fields
    if (!data.emergency || !data.lat || !data.long) {
      return NextResponse.json(
        { error: 'Missing required fields: emergency, lat, and long are required' },
        { status: 400 }
      );
    }

    // Forward the request to the external API
    const externalResponse = await fetch(
      'https://qalert.uniall.tk/api/postnotify?token=mySecretAlertifyToken2025',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    // Check if the external API request was successful
    if (!externalResponse.ok) {
      const errorText = await externalResponse.text();
      console.error('External API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to post emergency to external API', details: errorText },
        { status: externalResponse.status }
      );
    }

    // Get the response from external API
    const responseData = await externalResponse.json();

    // Return success response with data from external API
    return NextResponse.json(
      {
        message: 'Emergency posted online successfully',
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