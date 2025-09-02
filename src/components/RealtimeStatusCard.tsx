import type { PumpSystem } from '../lib/sample-data';

interface RealtimeStatusCardProps {
  pump: PumpSystem;
}

export default function RealtimeStatusCard({ pump }: RealtimeStatusCardProps) {
  if (!pump.estado_tiempo_real) {
    return null;
  }

  const {
    estado_operativo,
    presion_sistema,
    presion_succion,
    presion_descarga,
    caudal,
    rpm_motor_real,
    nivel_combustible,
    estado_fuente_alimentacion,
    voltaje_bateria_1,
    voltaje_bateria_2,
    arranques_motor,
    presion_arranque_cut_in,
    presion_parada_cut_out,
  } = pump.estado_tiempo_real;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Encendida':
        return 'text-green-600';
      case 'En Espera':
        return 'text-yellow-600';
      case 'Apagada':
        return 'text-gray-600';
      default:
        return 'text-red-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <div className="p-3 rounded-full bg-blue-500 text-white mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Estado en Tiempo Real</h2>
      </div>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-600">Estado Operativo:</span>
          <span className={`font-bold text-base ${getStatusColor(estado_operativo)}`}>{estado_operativo}</span>
        </div>
        {/* Changed grid-cols-2 to grid-cols-1 on mobile, sm:grid-cols-2 on small screens and up */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Presión Sistema:</span>
            <span className="text-gray-800 font-medium">{presion_sistema} PSI</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Presión Succión:</span>
            <span className="text-gray-800 font-medium">{presion_succion} PSI</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Presión Descarga:</span>
            <span className="text-gray-800 font-medium">{presion_descarga} PSI</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Caudal:</span>
            <span className="text-gray-800 font-medium">{caudal} GPM</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">RPM Motor:</span>
            <span className="text-gray-800 font-medium">{rpm_motor_real} RPM</span>
          </div>
          {nivel_combustible !== undefined && (
            <div className="flex justify-between">
              <span className="font-semibold text-gray-600">Nivel Combustible:</span>
              <span className="text-gray-800 font-medium">{nivel_combustible}%</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Alimentación:</span>
            <span className="text-gray-800 font-medium">{estado_fuente_alimentacion}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Batería 1:</span>
            <span className="text-gray-800 font-medium">{voltaje_bateria_1} V</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Batería 2:</span>
            <span className="text-gray-800 font-medium">{voltaje_bateria_2} V</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Arranques Motor:</span>
            <span className="text-gray-800 font-medium">{arranques_motor}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Cut-In:</span>
            <span className="text-gray-800 font-medium">{presion_arranque_cut_in} PSI</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Cut-Out:</span>
            <span className="text-gray-800 font-medium">{presion_parada_cut_out} PSI</span>
          </div>
        </div>
      </div>
    </div>
  );
}
