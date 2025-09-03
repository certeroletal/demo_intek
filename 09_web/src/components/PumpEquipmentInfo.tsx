import type { PumpSystem } from '../lib/sample-data';

interface PumpEquipmentInfoProps {
  pump: PumpSystem;
}

export default function PumpEquipmentInfo({ pump }: PumpEquipmentInfoProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-bold text-gray-800 border-b pb-2">Equipos</h2>
      <div className="space-y-4">
        {pump.equipos.map((equipo, index) => (
          <div key={index} className="p-3 bg-gray-50 rounded-md">
            <h3 className="font-bold text-md text-indigo-700">{equipo.tipo}</h3>
            <dl className="mt-1 text-sm text-gray-600 grid grid-cols-2 gap-x-4">
              <dt className="font-semibold">Marca:</dt>
              <dd className="text-gray-800">{equipo.marca}</dd>
              <dt className="font-semibold">Modelo:</dt>
              <dd className="text-gray-800">{equipo.modelo}</dd>
              <dt className="font-semibold">Serie:</dt>
              <dd className="text-gray-800">{equipo.serie}</dd>
            </dl>
          </div>
        ))}
      </div>
    </div>
  );
}
