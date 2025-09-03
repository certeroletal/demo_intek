import type { PumpSystem } from '../lib/sample-data';

// Definimos las propiedades que el componente espera recibir
interface PumpClientInfoProps {
  pump: PumpSystem;
}

// Componente para mostrar la información del cliente y la planta
export default function PumpClientInfo({ pump }: PumpClientInfoProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-bold text-gray-800 border-b pb-2">Información del Cliente y Planta</h2>
      
      {/* Client Info Section */}
      <div className="grid grid-cols-2 gap-y-2 text-sm">
        <span className="font-semibold text-gray-600">Cliente:</span>
        <span className="text-gray-800">{pump.cliente.nombre}</span>

        <span className="font-semibold text-gray-600">Planta:</span>
        <span className="text-gray-800">{pump.cliente.planta}</span>

        <span className="font-semibold text-gray-600">Dirección:</span>
        <span className="text-gray-800">{pump.cliente.direccion}</span> {/* Removed text-right */}

        <span className="font-semibold text-gray-600">Ubicación Bomba:</span>
        <span className="text-gray-800">{pump.ubicacion}</span> {/* Removed text-right */}

        <span className="font-semibold text-gray-600">Último Mant.:</span>
        <span className="text-gray-800">{pump.ultima_fecha_mantenimiento}</span> {/* Removed text-right */}
      </div>

      {/* Contact Info Section */}
      <div className="pt-4 mt-4 border-t">
        <h3 className="mb-2 font-semibold text-md text-gray-700">Contacto</h3>
        <div className="grid grid-cols-2 gap-y-2 text-sm">
          <span className="font-semibold text-gray-600">Nombre:</span>
          <span className="text-gray-800">{pump.cliente.contacto.nombre}</span>

          <span className="font-semibold text-gray-600">Correo:</span>
          <span className="text-gray-800">{pump.cliente.contacto.correo}</span>

          <span className="font-semibold text-gray-600">Fono:</span>
          <span className="text-gray-800">{pump.cliente.contacto.fono}</span>
        </div>
      </div>
    </div>
  );
}