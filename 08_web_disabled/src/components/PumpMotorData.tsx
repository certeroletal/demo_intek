import type { PumpSystem } from '../lib/sample-data';

interface PumpMotorDataProps {
  pump: PumpSystem;
}

export default function PumpMotorData({ pump }: PumpMotorDataProps) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-bold text-gray-800 border-b pb-2">Motor en Funcionamiento</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Temp. Agua:</span>
          <span className="text-gray-800">{pump.motor_funcionamiento.temp_agua.valor} {pump.motor_funcionamiento.temp_agua.unidad}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Presión Aceite:</span>
          <span className="text-gray-800">{pump.motor_funcionamiento.presion_aceite.valor} {pump.motor_funcionamiento.presion_aceite.unidad}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Presión Enfriamiento:</span>
          <span className="text-gray-800">{pump.motor_funcionamiento.presion_enfriamiento.valor} {pump.motor_funcionamiento.presion_enfriamiento.unidad}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">RPM Motor:</span>
          <span className="text-gray-800">{pump.motor_funcionamiento.rpm_motor.valor} {pump.motor_funcionamiento.rpm_motor.unidad}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Batería 1:</span>
          <span className="text-gray-800">{pump.motor_funcionamiento.bateria_1.valor} {pump.motor_funcionamiento.bateria_1.unidad}</span>
        </div>
        <div className="flex justify-between">
          <span className="font-semibold text-gray-600">Batería 2:</span>
          <span className="text-gray-800">{pump.motor_funcionamiento.bateria_2.valor} {pump.motor_funcionamiento.bateria_2.unidad}</span>
        </div>
      </div>
    </div>
  );
}
