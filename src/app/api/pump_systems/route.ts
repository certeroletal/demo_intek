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

// Import initial sample data to re-initialize if needed
import { pumpSystemsData as initialPumpSystemsData } from '@/lib/sample-data';

export async function GET() {
  try {
    let systems = await readData();

    // If systems array is empty, re-initialize with sample data
    if (systems.length === 0) {
      systems = [...initialPumpSystemsData];
    }

    // Simulate real-time data changes and alarm generation/resolution
    const updatedSystems = systems.map((system: any) => {
      if (system.estado_tiempo_real) {
        // Randomly adjust values within a larger range for visibility
        system.estado_tiempo_real.presion_sistema = parseFloat((system.estado_tiempo_real.presion_sistema + (Math.random() * 4 - 2)).toFixed(2)); // +/- 2 PSI
        system.estado_tiempo_real.rpm_motor_real = Math.round(system.estado_tiempo_real.rpm_motor_real + (Math.random() * 20 - 10)); // +/- 10 RPM
        system.estado_tiempo_real.voltaje_bateria_1 = parseFloat((system.estado_tiempo_real.voltaje_bateria_1 + (Math.random() * 0.4 - 0.2)).toFixed(2)); // +/- 0.2 V
        system.estado_tiempo_real.voltaje_bateria_2 = parseFloat((system.estado_tiempo_real.voltaje_bateria_2 + (Math.random() * 0.4 - 0.2)).toFixed(2)); // +/- 0.2 V

        // Ensure values stay within reasonable bounds (example bounds)
        system.estado_tiempo_real.presion_sistema = Math.max(100, Math.min(150, system.estado_tiempo_real.presion_sistema));
        system.estado_tiempo_real.rpm_motor_real = Math.max(1700, Math.min(1800, system.estado_tiempo_real.rpm_motor_real));
        system.estado_tiempo_real.voltaje_bateria_1 = Math.max(23, Math.min(26, system.estado_tiempo_real.voltaje_bateria_1));
        system.estado_tiempo_real.voltaje_bateria_2 = Math.max(23, Math.min(26, system.estado_tiempo_real.voltaje_bateria_2));
      }

      // Randomly generate a new alarm (e.g., 50% chance on each fetch)
      if (Math.random() < 0.5) { 
        const now = new Date();
        const date = now.toISOString().split('T')[0];
        const time = now.toTimeString().split(' ')[0].substring(0, 8);

        const alarmTypes = ['Presión', 'Temperatura', 'Falla Eléctrica', 'Mantenimiento', 'Nivel'];
        const randomAlarmType = alarmTypes[Math.floor(Math.random() * alarmTypes.length)];

        const messages = [
          'Presión fuera de rango.',
          'Temperatura del motor elevada.',
          'Falla en el suministro eléctrico.',
          'Mantenimiento preventivo requerido.',
          'Nivel de combustible bajo.',
          'Alarma de caudal.',
          'Batería baja.'
        ];
        const randomMessage = messages[Math.floor(Math.random() * messages.length)];

        const newAlarm = {
          fecha: date,
          hora: time,
          id_evento: `ALARM-${Date.now()}`,
          mensaje: randomMessage,
          tipo_alarma: randomAlarmType,
          bomba_asociada: system.cliente.planta || 'Desconocida',
          fecha_inicio: date,
          hora_inicio: time,
          estado: 'activa',
        };

        if (!system.todas_las_alarmas) {
          system.todas_las_alarmas = [];
        }
        system.todas_las_alarmas.unshift(newAlarm); // Add to the beginning

        if (!system.alarmas_activas) {
          system.alarmas_activas = [];
        }
        // Only add to active alarms if it's a new active alarm (all generated are active for now)
        system.alarmas_activas.unshift(newAlarm);
      }

      // Randomly resolve an active alarm (e.g., 50% chance if there are active alarms)
      if (system.alarmas_activas && system.alarmas_activas.length > 0 && Math.random() < 0.5) {
        const resolvedAlarmIndex = Math.floor(Math.random() * system.alarmas_activas.length);
        const resolvedAlarm = system.alarmas_activas[resolvedAlarmIndex];

        // Update status in todas_las_alarmas
        const alarmInAll = system.todas_las_alarmas.find((a: any) => a.id_evento === resolvedAlarm.id_evento);
        if (alarmInAll) {
          alarmInAll.estado = 'resuelta';
          const now = new Date();
          alarmInAll.fecha_fin = now.toISOString().split('T')[0];
          alarmInAll.hora_fin = now.toTimeString().split(' ')[0].substring(0, 8);
        }

        // Create a new array for active alarms without the resolved one
        system.alarmas_activas = system.alarmas_activas.filter((a: any) => a.id_evento !== resolvedAlarm.id_evento);
      }

      return system;
    });

    await writeData(updatedSystems); // Persist the changes

    return NextResponse.json(updatedSystems);
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
