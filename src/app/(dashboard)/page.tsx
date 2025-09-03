"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import type { PumpSystem } from '@/lib/sample-data';
import ControllerInfoCard from '@/components/ControllerInfoCard';
import RealtimeStatusCard from '@/components/RealtimeStatusCard';
import ActiveAlarmsList from '@/components/ActiveAlarmsList';
import AllAlarmsTable from '@/components/AllAlarmsTable';

// Icon for "Ver Detalles de la Bomba"
const InfoIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
);

// Icon for "Cerrar Sesión"
const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
);

export default function Home() {
  const { logout } = useAuth();
  const [pumpSystems, setPumpSystems] = useState<PumpSystem[]>([]);
  const [selectedSystem, setSelectedSystem] = useState<PumpSystem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Use a ref to store the latest selectedSystem value without making fetchData dependent on it
  const selectedSystemRef = useRef(selectedSystem);
  useEffect(() => {
    selectedSystemRef.current = selectedSystem;
  }, [selectedSystem]);

  const fetchData = useCallback(async () => {
    try {
      const response = await fetch('/api/pump_systems');
      if (response.ok) {
        const data = await response.json();
        setPumpSystems(data);
        
        // Use the ref to get the latest selectedSystem value
        const currentSelectedSystem = selectedSystemRef.current;

        // Logic to maintain selectedSystem across fetches
        if (data.length === 1) {
          setSelectedSystem(data[0]);
        } else if (data.length > 1 && currentSelectedSystem) {
          const updatedSelected = data.find((s: PumpSystem) => s.cliente.planta === currentSelectedSystem.cliente.planta);
          setSelectedSystem(updatedSelected || data[0]);
        } else if (data.length > 0 && !currentSelectedSystem) {
          setSelectedSystem(data[0]);
        } else if (data.length === 0) {
          setSelectedSystem(null);
        }
      } else {
        console.error('Error al obtener los datos de la API');
        setPumpSystems([]);
        setSelectedSystem(null);
      }
    } catch (error) {
      console.error('Error de red o de servidor:', error);
      setPumpSystems([]);
      setSelectedSystem(null);
    } finally {
      setIsLoading(false);
    }
  }, [setPumpSystems, setSelectedSystem]); // Removed selectedSystem from dependencies

  useEffect(() => {
    fetchData(); // Initial fetch

    const intervalId = setInterval(fetchData, 5000); // Poll every 5 seconds

    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [fetchData]); // fetchData is now a stable dependency

  const handleSelectSystem = (system: PumpSystem) => {
    const slug = system.cliente.planta
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .replace(/\s+/g, '-')
      .toLowerCase();
    // router.push(`/pump-details/${slug}`);
  };

  const handleLogout = () => {
    logout();
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard de Monitoreo</h1>
        <div className="flex space-x-2"> {/* Container for buttons */}
          {selectedSystem && (
            <button
              onClick={() => handleSelectSystem(selectedSystem)}
              className="p-2 rounded-full bg-indigo-600 text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              title="Ver Detalles de la Bomba"
            >
              <InfoIcon />
            </button>
          )}
          <button
            onClick={handleLogout}
            className="p-2 rounded-full bg-red-600 text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            title="Cerrar Sesión"
          >
            <LogoutIcon />
          </button>
        </div>
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
                <RealtimeStatusCard key={selectedSystem.cliente.planta} pump={selectedSystem} />
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