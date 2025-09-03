import { NextResponse } from 'next/server';
import { pumpSystemsData } from '@/lib/sample-data';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const pumpSystem = pumpSystemsData.find(pump =>
    pump.cliente.planta
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Remove accents
      .replace(/[^a-zA-Z0-9\s-]/g, "") // Remove all non-alphanumeric chars except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .toLowerCase() === id
  );

  if (pumpSystem) {
    return NextResponse.json(pumpSystem);
  } else {
    return NextResponse.json({ message: 'Pump system not found' }, { status: 404 });
  }
}
