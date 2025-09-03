import type { PumpSystem } from '../lib/sample-data';

interface PumpPlateDataProps {
  pump: PumpSystem;
}

export default function PumpPlateData({ pump }: PumpPlateDataProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-bold text-gray-800 border-b pb-2">Datos de Placa</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">GPM:</span>
          <span className="text-gray-800">{pump.datos_placa.gpm}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">RPM:</span>
          <span className="text-gray-800">{pump.datos_placa.rpm}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Presión al 100%:</span>
          <span className="text-gray-800">{pump.datos_placa.presion_100_porciento}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Presión al 150%:</span>
          <span className="text-gray-800">{pump.datos_placa.presion_150_porciento}</span>
        </div>
        <div className="flex justify-between col-span-2">
          <span className="font-semibold text-gray-600">Máx. Presión:</span>
          <span className="text-gray-800">{pump.datos_placa.max_presion}</span>
        </div>
      </div>
    </div>
  );
}
