"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import type { PumpSystem } from '@/lib/sample-data';
import PumpClientInfo from '@/components/PumpClientInfo';
import PumpEquipmentInfo from '@/components/PumpEquipmentInfo';
import PumpPlateData from '@/components/PumpPlateData';
import PumpMotorData from '@/components/PumpMotorData';
import PumpGeneralInfoCard from '@/components/PumpGeneralInfoCard';

export default function PumpDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [pumpSystem, setPumpSystem] = useState<PumpSystem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check authentication
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }

    if (id) {
      const fetchPumpDetails = async () => {
        try {
          const response = await fetch(`/api/pump_systems/${id}`);
          if (response.ok) {
            const data = await response.json();
            setPumpSystem(data);
          } else {
            const errorData = await response.json();
            setError(errorData.message || 'Error al cargar los detalles de la bomba.');
          }
        } catch (err) {
          setError('Error de red o de servidor al cargar los detalles.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPumpDetails();
    }
  }, [id, router]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
        <p className="text-lg text-gray-600">Cargando detalles de la bomba...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
        <p className="text-lg text-red-600">Error: {error}</p>
      </main>
    );
  }

  if (!pumpSystem) {
    return (
      <main className="min-h-screen bg-gray-100 p-8 flex justify-center items-center">
        <p className="text-lg text-gray-600">Bomba no encontrada.</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 p-3 sm:p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Detalles de la Bomba: {pumpSystem.cliente.planta}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-1 space-y-4 sm:space-y-6">
            <PumpClientInfo pump={pumpSystem} />
            <PumpGeneralInfoCard pump={pumpSystem} />
          </div>
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="md:col-span-2">
              <PumpEquipmentInfo pump={pumpSystem} />
            </div>
            <PumpPlateData pump={pumpSystem} />
            <PumpMotorData pump={pumpSystem} />
          </div>
        </div>
      </div>
    </main>
  );
}
