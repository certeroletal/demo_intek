"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { PumpSystem } from '@/lib/sample-data';

// Creamos un estado inicial vacío basado en la estructura de PumpSystem
const initialPumpSystemState: PumpSystem = {
  cliente: { nombre: '', direccion: '', rut: '', planta: '', contacto: { nombre: '', fono: '', correo: '' } },
  informe: { ot_jdl: '', oc: '', informe_terreno: '', fecha: '' },
  equipos: [
    { tipo: 'MOTOR', marca: '', modelo: '', serie: '' },
    { tipo: 'BOMBA PRINCIPAL', marca: '', modelo: '', serie: '' },
    { tipo: 'TABLERO PRINCIPAL', marca: '', modelo: '', serie: '' },
    { tipo: 'TABLERO JOCKEY', marca: '', modelo: '', serie: '' },
  ],
  datos_placa: { gpm: 0, rpm: 0, presion_100_porciento: 0, presion_150_porciento: 0, max_presion: 0 },
  motor_funcionamiento: {
    temp_agua: { valor: 0, unidad: '°C' },
    presion_aceite: { valor: 0, unidad: 'PSI' },
    presion_enfriamiento: { valor: 0, unidad: 'PSI' },
    rpm_motor: { valor: 0, unidad: 'RPM' },
    bateria_1: { valor: 0, unidad: 'VOLT' },
    bateria_2: { valor: 0, unidad: 'VOLT' },
  },
  ubicacion: '',
  ultima_fecha_mantenimiento: '',
  capacidad: { gpm: 0, psi: 0 },
  tipo_bomba: '',
  fabricante: '',
};

// Componente de Input reutilizable para mantener el código limpio
interface FormInputProps {
  label: string;
  id: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  [key: string]: unknown;
}

function FormInput({ label, id, value, onChange, ...props }: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        className="block w-full px-3 py-2 sm:py-3 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm sm:text-base transition-all duration-200"
        {...props}
      />
    </div>
  );
}

export default function SetupPage() {
  const router = useRouter();
  const [pumpSystem, setPumpSystem] = useState<PumpSystem>(initialPumpSystemState);

  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
  }, [router]);

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPumpSystem(prev => ({ ...prev, cliente: { ...prev.cliente, [name]: value } }));
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPumpSystem(prev => ({ 
      ...prev, 
      cliente: { 
        ...prev.cliente, 
        contacto: { ...prev.cliente.contacto, [name]: value } 
      } 
    }));
  };

  const handleEquipmentChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedEquipos = pumpSystem.equipos.map((equipo, i) => 
      i === index ? { ...equipo, [name]: value } : equipo
    );
    setPumpSystem(prev => ({ ...prev, equipos: updatedEquipos }));
  };

  const handlePlacaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPumpSystem(prev => ({ ...prev, datos_placa: { ...prev.datos_placa, [name]: Number(value) } }));
  };

  const handleMotorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPumpSystem(prev => ({ 
      ...prev, 
      motor_funcionamiento: { 
        ...prev.motor_funcionamiento, 
        [name]: { ...prev.motor_funcionamiento[name as keyof typeof prev.motor_funcionamiento], valor: Number(value) } 
      } 
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Enviando configuración:', pumpSystem);
    try {
      const response = await fetch('/api/pump_systems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pumpSystem),
      });

      if (response.ok) {
        alert('¡Configuración guardada con éxito!');
        router.push('/');
      } else {
        const errorData = await response.json();
        console.error('Error al guardar la configuración:', errorData);
        alert(`Hubo un error al guardar: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error de red o de servidor:', error);
      alert('Hubo un error de conexión al intentar guardar la configuración.');
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-3 sm:p-4 lg:p-8">
      <div className="max-w-4xl mx-auto bg-white p-4 sm:p-6 lg:p-8 rounded-lg shadow-md">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 border-b pb-3 sm:pb-4">Agregar Nueva Sala de Bombas</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-8">

            {/* SECCIÓN 1: INFORMACIÓN DEL CLIENTE */}
            <div className="p-4 sm:p-6 border rounded-md">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">1. Información del Cliente</h2>
              <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                <FormInput label="Nombre Cliente" id="cliente_nombre" name="nombre" value={pumpSystem.cliente.nombre} onChange={handleClientChange} required />
                <FormInput label="Planta" id="cliente_planta" name="planta" value={pumpSystem.cliente.planta} onChange={handleClientChange} required />
                <FormInput label="Dirección" id="cliente_direccion" name="direccion" value={pumpSystem.cliente.direccion} onChange={handleClientChange} className="md:col-span-2" />
                <FormInput label="RUT" id="cliente_rut" name="rut" value={pumpSystem.cliente.rut} onChange={handleClientChange} />
              </div>
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
                <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Contacto en Planta</h3>
                <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2">
                  <FormInput label="Nombre Contacto" id="contacto_nombre" name="nombre" value={pumpSystem.cliente.contacto.nombre} onChange={handleContactChange} />
                  <FormInput label="Fono" id="contacto_fono" name="fono" value={pumpSystem.cliente.contacto.fono} onChange={handleContactChange} />
                  <FormInput label="Correo" id="contacto_correo" name="correo" type="email" value={pumpSystem.cliente.contacto.correo} onChange={handleContactChange} className="md:col-span-2" />
                </div>
              </div>
            </div>

            {/* SECCIÓN 2: EQUIPOS */}
            <div className="p-4 sm:p-6 border rounded-md">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">2. Equipos</h2>
              <div className="space-y-4 sm:space-y-6">
                {pumpSystem.equipos.map((equipo, index) => (
                  <div key={index} className="p-3 sm:p-4 border rounded-lg">
                    <h3 className="font-bold text-indigo-700 text-sm sm:text-base">{equipo.tipo}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mt-2">
                      <FormInput label="Marca" id={`marca-${index}`} name="marca" value={equipo.marca} onChange={(e) => handleEquipmentChange(index, e)} />
                      <FormInput label="Modelo" id={`modelo-${index}`} name="modelo" value={equipo.modelo} onChange={(e) => handleEquipmentChange(index, e)} />
                      <FormInput label="Serie" id={`serie-${index}`} name="serie" value={equipo.serie} onChange={(e) => handleEquipmentChange(index, e)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECCIÓN 3: DATOS DE PLACA Y MOTOR */}
            <div className="p-6 border rounded-md">
              <h2 className="text-xl font-semibold mb-4">3. Datos de Placa y Motor</h2>
              
              {/* Sub-sección: Datos de Placa */}
              <div className="pt-4">
                <h3 className="text-lg font-semibold mb-4 text-indigo-700">Datos de Placa</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <FormInput label="GPM" id="gpm" name="gpm" type="number" value={pumpSystem.datos_placa.gpm} onChange={handlePlacaChange} />
                  <FormInput label="RPM" id="rpm" name="rpm" type="number" value={pumpSystem.datos_placa.rpm} onChange={handlePlacaChange} />
                  <FormInput label="Presión al 100%" id="presion_100_porciento" name="presion_100_porciento" type="number" value={pumpSystem.datos_placa.presion_100_porciento} onChange={handlePlacaChange} />
                  <FormInput label="Presión al 150%" id="presion_150_porciento" name="presion_150_porciento" type="number" value={pumpSystem.datos_placa.presion_150_porciento} onChange={handlePlacaChange} />
                  <FormInput label="Máx. Presión" id="max_presion" name="max_presion" type="number" value={pumpSystem.datos_placa.max_presion} onChange={handlePlacaChange} />
                </div>
              </div>

              {/* Sub-sección: Datos del Motor en Funcionamiento */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-lg font-semibold mb-4 text-indigo-700">Motor en Funcionamiento</h3>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <FormInput label="Temp. Agua (°C)" id="temp_agua" name="temp_agua" type="number" value={pumpSystem.motor_funcionamiento.temp_agua.valor} onChange={handleMotorChange} />
                  <FormInput label="Presión Aceite (PSI)" id="presion_aceite" name="presion_aceite" type="number" value={pumpSystem.motor_funcionamiento.presion_aceite.valor} onChange={handleMotorChange} />
                  <FormInput label="Presión Enfriamiento (PSI)" id="presion_enfriamiento" name="presion_enfriamiento" type="number" value={pumpSystem.motor_funcionamiento.presion_enfriamiento.valor} onChange={handleMotorChange} />
                  <FormInput label="RPM Motor" id="rpm_motor" name="rpm_motor" type="number" value={pumpSystem.motor_funcionamiento.rpm_motor.valor} onChange={handleMotorChange} />
                  <FormInput label="Batería 1 (VOLT)" id="bateria_1" name="bateria_1" type="number" value={pumpSystem.motor_funcionamiento.bateria_1.valor} onChange={handleMotorChange} />
                  <FormInput label="Batería 2 (VOLT)" id="bateria_2" name="bateria_2" type="number" value={pumpSystem.motor_funcionamiento.bateria_2.valor} onChange={handleMotorChange} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t">
            <button
              type="submit"
              className="w-full px-6 py-3 text-lg font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Guardar Configuración
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}