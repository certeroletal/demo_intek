import type { PumpSystem } from '../lib/sample-data';

interface AllAlarmsTableProps {
  pump: PumpSystem;
}

export default function AllAlarmsTable({ pump }: AllAlarmsTableProps) {
  const allAlarms = pump.todas_las_alarmas || [];
  const latestAlarms = allAlarms.slice(0, 10); // Get the 10 most recent alarms

  return (
    <div className="bg-white rounded-lg shadow-md p-6 col-span-full">
      <div className="flex items-center mb-4">
        <div className="p-3 rounded-full bg-gray-500 text-white mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Historial de Alarmas Activas</h2>
      </div>
      {(latestAlarms.length === 0) ? (
        <p className="text-gray-600 text-sm">No hay registros de alarmas.</p>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha Inicio
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hora Inicio
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo Alarma
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Bomba Asociada
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mensaje
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {latestAlarms.map((alarm, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {alarm.fecha_inicio}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {alarm.hora_inicio}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {alarm.tipo_alarma}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {alarm.bomba_asociada}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                      {alarm.mensaje}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${alarm.estado === 'activa' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {alarm.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {latestAlarms.map((alarm, index) => (
              <div key={index} className="bg-gray-50 rounded-lg shadow-sm p-4 text-sm border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-800">{alarm.tipo_alarma}</span>
                  <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${alarm.estado === 'activa' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                    {alarm.estado}
                  </span>
                </div>
                <p className="text-gray-700 mb-1">{alarm.mensaje}</p>
                <p className="text-gray-500 text-xs">
                  <span className="font-semibold">Fecha:</span> {alarm.fecha_inicio} <span className="font-semibold">Hora:</span> {alarm.hora_inicio}
                </p>
                <p className="text-gray-500 text-xs">
                  <span className="font-semibold">Bomba:</span> {alarm.bomba_asociada}
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}