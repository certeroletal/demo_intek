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

  const DataRow = ({ label, value, unit = '' }: { label: string; value: string | number; unit?: string }) => (
    <div className="grid grid-cols-2 gap-x-4">
      <span className="font-semibold text-gray-600 text-sm">{label}:</span>
      <span className="text-gray-800 font-medium text-sm">{value} {unit}</span>
    </div>
  );

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
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-x-4">
          <span className="font-semibold text-gray-600 text-sm">Estado Operativo:</span>
          <span className={`font-bold text-base ${getStatusColor(estado_operativo)}`}>{estado_operativo}</span>
        </div>
        
        <div className="border-t pt-3 mt-3">
          <h3 className="font-semibold text-gray-700 mb-2">Parámetros de Presión</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
            <DataRow label="Presión Sistema" value={presion_sistema} unit="PSI" />
            <DataRow label="Presión Succión" value={presion_succion} unit="PSI" />
            <DataRow label="Presión Descarga" value={presion_descarga} unit="PSI" />
            <DataRow label="Cut-In" value={presion_arranque_cut_in} unit="PSI" />
            <DataRow label="Cut-Out" value={presion_parada_cut_out} unit="PSI" />
          </div>
        </div>

        <div className="border-t pt-3 mt-3">
          <h3 className="font-semibold text-gray-700 mb-2">Parámetros de Motor</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
            <DataRow label="Caudal" value={caudal} unit="GPM" />
            <DataRow label="RPM Motor" value={rpm_motor_real} unit="RPM" />
            {nivel_combustible !== undefined && (
              <DataRow label="Nivel Combustible" value={nivel_combustible} unit="%" />
            )}
            <DataRow label="Arranques Motor" value={arranques_motor} />
          </div>
        </div>

        <div className="border-t pt-3 mt-3">
          <h3 className="font-semibold text-gray-700 mb-2">Baterías y Alimentación</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
            <DataRow label="Alimentación" value={estado_fuente_alimentacion} />
            <DataRow label="Batería 1" value={voltaje_bateria_1} unit="V" />
            <DataRow label="Batería 2" value={voltaje_bateria_2} unit="V" />
          </div>
        </div>
      </div>
    </div>
  );
}