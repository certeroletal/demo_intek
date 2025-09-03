import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Path to the JSON file that acts as our database
const dataFilePath = path.join(process.cwd(), 'data', 'pump-systems.json');

// Helper function to read data from the JSON file
async function readData() {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    // If the file doesn't exist or is empty, return an empty array
    return [];
  }
}

// Helper function to write data to the JSON file
async function writeData(data: any) {
  await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const systems = await readData();
    return NextResponse.json(systems);
  } catch (error) {
    return NextResponse.json({ message: 'Error reading data', error }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newSystem = await request.json();

    // Basic validation
    if (!newSystem || !newSystem.cliente || !newSystem.equipos) {
      return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
    }

    const systems = await readData();
    systems.push(newSystem);
    await writeData(systems);

    return NextResponse.json({ message: 'System added successfully', system: newSystem }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Error processing request', error }, { status: 500 });
  }
}
