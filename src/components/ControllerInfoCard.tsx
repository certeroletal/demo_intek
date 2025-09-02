import type { PumpSystem } from '../lib/sample-data';

interface ControllerInfoCardProps {
  pump: PumpSystem;
}

export default function ControllerInfoCard({ pump }: ControllerInfoCardProps) {
  if (!pump.controlador) {
    return null; // Or a placeholder if controller info is not available
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <div className="p-3 rounded-full bg-indigo-500 text-white mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 16v-2m0-10v2m0 6v2M6 12H4m16 0h-2m-10 0h2m6 0h2M9 15l-2 2m10-10l-2 2m0 6l2 2m-10-2l2-2" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Información del Controlador</h2>
      </div>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Modelo:</span>
          <span className="text-gray-800 font-medium">{pump.controlador.modelo}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">N/S:</span>
          <span className="text-gray-800 font-medium">{pump.controlador.serie}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Versión de Software:</span>
          <span className="text-gray-800 font-medium">{pump.controlador.version_software}</span>
        </div>
      </div>
    </div>
  );
}