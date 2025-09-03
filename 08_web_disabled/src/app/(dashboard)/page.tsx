"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { PumpSystem } from '@/lib/sample-data';
import ControllerInfoCard from '@/components/ControllerInfoCard';
import RealtimeStatusCard from '@/components/RealtimeStatusCard';
import ActiveAlarmsList from '@/components/ActiveAlarmsList';
import AllAlarmsTable from '@/components/AllAlarmsTable';

export default function Home() {
  const router = useRouter();
  const [pumpSystems, setPumpSystems] = useState<PumpSystem[]>([]);
  const [selectedSystem, setSelectedSystem] = useState<PumpSystem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch('/api/pump_systems');
        if (response.ok) {
          const data = await response.json();
          setPumpSystems(data);
          if (data.length === 1) {
            setSelectedSystem(data[0]);
          }
        } else {
          console.error('Error al obtener los datos de la API');
          setPumpSystems([]);
        }
      } catch (error) {
        console.error('Error de red o de servidor:', error);
        setPumpSystems([]);
      }
      setIsLoading(false);
    };

    fetchData();
  }, [router]);

  const handleSelectSystem = (system: PumpSystem) => {
    const slug = system.cliente.planta
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .replace(/\s+/g, '-')
      .toLowerCase();
    router.push(`/pump-details/${slug}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-600">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard de Monitoreo</h1>
        {selectedSystem && (
          <button
            onClick={() => handleSelectSystem(selectedSystem)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700"
          >
            Ver Detalles de la Bomba
          </button>
        )}
      </div>

      {pumpSystems.length === 0 ? (
        <div className="text-center bg-white p-6 sm:p-12 rounded-lg shadow-md">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">No hay Salas de Bombas Configradas</h2>
          <p className="mt-4 text-gray-600 text-sm sm:text-base">Para empezar, necesitas añadir la configuración de una nueva sala de bombas.</p>
          <Link href="/setup">
            <span className="mt-6 inline-block px-4 sm:px-6 py-2 sm:py-3 text-base sm:text-lg font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 cursor-pointer transition-all duration-300">
              Ir a Configuración
            </span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            {pumpSystems.length > 1 && !selectedSystem && (
              <div className="p-4 sm:p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-lg sm:text-xl font-bold">Seleccione una Sala de Bombas</h2>
                <ul className="mt-4 space-y-2">
                  {pumpSystems.map((pump, index) => (
                    <li
                      key={index}
                      onClick={() => handleSelectSystem(pump)}
                      className="p-3 sm:p-4 border rounded-md hover:bg-gray-100 cursor-pointer transition-all duration-300 active:scale-95"
                    >
                      <p className="font-semibold text-indigo-700 text-sm sm:text-base">{pump.cliente.planta}</p>
                      <p className="text-xs sm:text-sm text-gray-600">{pump.cliente.nombre}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {selectedSystem && (
              <>
                <ControllerInfoCard pump={selectedSystem} />
                <RealtimeStatusCard pump={selectedSystem} />
              </>
            )}
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {selectedSystem && (
              <>
                <ActiveAlarmsList pump={selectedSystem} />
                <AllAlarmsTable pump={selectedSystem} />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}