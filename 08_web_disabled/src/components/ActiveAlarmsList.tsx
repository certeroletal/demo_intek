import type { PumpSystem } from '../lib/sample-data';

interface ActiveAlarmsListProps {
  pump: PumpSystem;
}

export default function ActiveAlarmsList({ pump }: ActiveAlarmsListProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-4">
        <div className="p-3 rounded-full bg-red-500 text-white mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Alarmas Activas</h2>
      </div>
      {(!pump.alarmas_activas || pump.alarmas_activas.length === 0) ? (
        <p className="text-gray-600 text-sm">No hay alarmas activas.</p>
      ) : (
        <ul className="space-y-3 text-sm">
          {pump.alarmas_activas.map((alarm, index) => (
            <li key={index} className="flex justify-between items-center">
              <span className={`font-semibold ${alarm.severidad === 'Crítica' ? 'text-red-600' : 'text-yellow-600'}`}>
                {alarm.descripcion}
              </span>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${alarm.severidad === 'Crítica' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {alarm.severidad}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}