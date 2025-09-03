import type { PumpSystem } from '../lib/sample-data';

interface PumpGeneralInfoCardProps {
  pump: PumpSystem;
}

export default function PumpGeneralInfoCard({ pump }: PumpGeneralInfoCardProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-bold text-gray-800 border-b pb-2">Información General de la Bomba</h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Identificador:</span>
          <span className="text-gray-800">{pump.equipos[1]?.serie || 'N/A'}</span> {/* Assuming main pump is at index 1 */}
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Tipo de Bomba:</span>
          <span className="text-gray-800">{pump.tipo_bomba}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Fabricante:</span>
          <span className="text-gray-800">{pump.fabricante}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Capacidad (GPM):</span>
          <span className="text-gray-800">{pump.capacidad.gpm}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Capacidad (PSI):</span>
          <span className="text-gray-800">{pump.capacidad.psi}</span>
        </div>
        {pump.documentacion_adjunta && pump.documentacion_adjunta.length > 0 && (
          <div className="pt-4 mt-4 border-t">
            <h3 className="mb-2 font-semibold text-md text-gray-700">Documentación Adjunta</h3>
            <ul className="list-disc pl-5 space-y-1">
              {pump.documentacion_adjunta.map((doc, index) => (
                <li key={index}>
                  <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                    {doc.nombre}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
