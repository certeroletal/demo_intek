
import type { PumpSystem } from '../lib/sample-data';

interface AllAlarmsTableProps {
  pump: PumpSystem;
}

export default function AllAlarmsTable({ pump }: AllAlarmsTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 col-span-full">
      <div className="flex items-center mb-4">
        <div className="p-3 rounded-full bg-gray-500 text-white mr-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800">Todas las Alarmas</h2>
      </div>
      {(!pump.todas_las_alarmas || pump.todas_las_alarmas.length === 0) ? (
        <p className="text-gray-600 text-sm">No hay registros de alarmas.</p>
      ) : (
        <div className="overflow-x-auto">
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
              {pump.todas_las_alarmas.map((alarm, index) => (
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
      )}
    </div>
  );
}
