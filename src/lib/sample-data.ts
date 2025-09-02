export type PumpSystem = {
  cliente: {
    nombre: string;
    direccion: string;
    rut: string;
    planta: string;
    contacto: {
      nombre: string;
      fono: string;
      correo: string;
    };
  };
  informe: {
    ot_jdl: string;
    oc: string;
    informe_terreno: string;
    fecha: string;
  };
  equipos: {
    tipo: string;
    marca: string;
    modelo: string;
    serie: string;
    horas_inicio?: number;
    horas_final?: number;
  }[];
  datos_placa: {
    gpm: number;
    rpm: number;
    presion_100_porciento: number;
    presion_150_porciento: number;
    max_presion: number;
  };
  motor_funcionamiento: {
    temp_agua: { valor: number; unidad: string };
    presion_aceite: { valor: number; unidad: string };
    presion_enfriamiento: { valor: number; unidad: string };
    rpm_motor: { valor: number; unidad: string };
    bateria_1: { valor: number; unidad: string };
    bateria_2: { valor: number; unidad: string };
  };
  // Nuevos campos para información del controlador
  controlador?: {
    modelo: string;
    serie: string;
    version_software: string;
  };
  // Nuevos campos para estado en tiempo real
  estado_tiempo_real?: {
    presion_sistema: number;
    voltaje_bateria_1: number;
    voltaje_bateria_2: number;
    arranques_motor: number;
    presion_arranque_cut_in: number;
    presion_parada_cut_out: number;
    // Nuevos campos para monitoreo en tiempo real del caso de uso
    estado_operativo: 'Encendida' | 'Apagada' | 'En Espera';
    presion_succion: number;
    presion_descarga: number;
    caudal: number;
    rpm_motor_real: number; // Renamed to avoid conflict with datos_placa.rpm
    nivel_combustible?: number; // For diesel pumps
    estado_fuente_alimentacion: string;
  };
  // Nuevos campos para alarmas
  alarmas_activas?: {
    codigo: string;
    descripcion: string;
    severidad: string;
  }[];
  todas_las_alarmas?: {
    fecha: string;
    hora: string;
    id_evento: string;
    mensaje: string;
    // Nuevos campos para alarmas del caso de uso
    tipo_alarma: string;
    bomba_asociada: string;
    fecha_inicio: string;
    hora_inicio: string;
    fecha_fin?: string;
    hora_fin?: string;
    estado: 'activa' | 'resuelta';
  }[];
  // Nuevos campos de información de bombas de incendio del caso de uso
  ubicacion: string;
  ultima_fecha_mantenimiento: string;
  capacidad: { gpm: number; psi: number };
  tipo_bomba: string;
  fabricante: string;
  documentacion_adjunta?: { nombre: string; url: string }[];
};

export const pumpSystemsData: PumpSystem[] = [
  {
    cliente: {
      nombre: "OXIQUIM S.A.",
      direccion: "CAMINO COSTERO 271, QUINTERO-CHILE",
      rut: "80.326.500-3",
      planta: "TERMINAL MARÍTIMO QUINTERO (P-802B)",
      contacto: {
        nombre: "GUSTAVO LABRA",
        fono: "+56322458737",
        correo: "gustavo.labra@oxiquim.com",
      },
    },
    informe: {
      ot_jdl: "855-847",
      oc: "CONTRATO",
      informe_terreno: "2307-0331",
      fecha: "2023-11-13",
    },
    equipos: [
      { tipo: "MOTOR", marca: "CLARKE", modelo: "JX6H-UFAD88", serie: "RG6135L028341", horas_inicio: 96.5, horas_final: 96.9 },
      { tipo: "BOMBA PRINCIPAL", marca: "PATTERSON", modelo: "16X12X21 SSC", serie: "FP-C000124163-02" },
      { tipo: "TABLERO PRINCIPAL", marca: "TORNATECH", modelo: "GPD-24-220", serie: "WZ10855159" },
      { tipo: "TABLERO JOCKEY", marca: "FIRETROL", modelo: "FTA550FA6007", serie: "1013745-01-RE" },
    ],
    datos_placa: {
      gpm: 5000,
      rpm: 1750,
      presion_100_porciento: 135,
      presion_150_porciento: 111,
      max_presion: 148,
    },
    motor_funcionamiento: {
      temp_agua: { valor: 87.2, unidad: "°C" },
      presion_aceite: { valor: 50, unidad: "PSI" },
      presion_enfriamiento: { valor: 35, unidad: "PSI" },
      rpm_motor: { valor: 1765, unidad: "RPM" },
      bateria_1: { valor: 24.7, unidad: "VOLT" },
      bateria_2: { valor: 23.9, unidad: "VOLT" },
    },
    controlador: {
      modelo: "Controlador XYZ",
      serie: "SN-12345",
      version_software: "1.0.0",
    },
    estado_tiempo_real: {
      presion_sistema: 120,
      voltaje_bateria_1: 24.5,
      voltaje_bateria_2: 24.1,
      arranques_motor: 150,
      presion_arranque_cut_in: 110,
      presion_parada_cut_out: 130,
      // Nuevos campos para monitoreo en tiempo real del caso de uso
      estado_operativo: 'Encendida',
      presion_succion: 10,
      presion_descarga: 120,
      caudal: 500,
      rpm_motor_real: 1750,
      nivel_combustible: 80, // For diesel pumps
      estado_fuente_alimentacion: 'Normal',
    },
    alarmas_activas: [
      { codigo: "ALARM-001", descripcion: "Baja presión de agua", severidad: "Crítica" },
      { codigo: "WARN-002", descripcion: "Mantenimiento pendiente", severidad: "Advertencia" },
    ],
    todas_las_alarmas: [
      { fecha: "2023-01-01", hora: "10:00", id_evento: "EVT-001", mensaje: "Inicio de operación", tipo_alarma: "Operación", bomba_asociada: "Bomba Principal", fecha_inicio: "2023-01-01", hora_inicio: "10:00", estado: "resuelta" },
      { fecha: "2023-01-01", hora: "10:30", id_evento: "ALARM-001", mensaje: "Baja presión de agua", tipo_alarma: "Presión", bomba_asociada: "Bomba Principal", fecha_inicio: "2023-01-01", hora_inicio: "10:30", estado: "activa" },
      { fecha: "2023-01-02", hora: "08:00", id_evento: "WARN-002", mensaje: "Mantenimiento pendiente", tipo_alarma: "Mantenimiento", bomba_asociada: "Bomba Jockey", fecha_inicio: "2023-01-02", hora_inicio: "08:00", estado: "activa" },
    ],
    // Dummy data for new pump info fields
    ubicacion: "Sala de Bombas 1, Edificio Principal",
    ultima_fecha_mantenimiento: "2024-07-15",
    capacidad: { gpm: 5000, psi: 150 },
    tipo_bomba: "Eléctrica",
    fabricante: "Patterson",
    documentacion_adjunta: [
      { nombre: "Manual de Operación", url: "/docs/manual_operacion.pdf" },
      { nombre: "Esquema Eléctrico", url: "/docs/esquema_electrico.pdf" },
    ],
  },
  // Puedes añadir más salas de bombas aquí para probar la funcionalidad de selección
];
