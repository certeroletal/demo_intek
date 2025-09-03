import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Force dynamic rendering

export async function GET() {
  // Return a simple JSON object for debugging purposes
  return NextResponse.json({ status: "ok", message: "This is a test response." });
}

export async function POST(request: Request) {
  // For hardcoded data, POST requests will not persist changes.
  // They will just simulate success.
  try {
    const newSystem = await request.json();
    console.log('Received new system (not persisted in this demo mode):', newSystem);
    return NextResponse.json({ message: 'System received (not persisted in demo mode)', system: newSystem }, { status: 201 });
  } catch (error) {
    console.error('Error processing request in demo mode:', error);
    return NextResponse.json({ message: 'Error processing request', error }, { status: 500 });
  }
}
