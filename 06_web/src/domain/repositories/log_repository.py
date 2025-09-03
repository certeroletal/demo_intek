
import os
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, MetaData, Table, text
from sqlalchemy.dialects.postgresql import insert
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL no está configurada en el archivo .env")

engine = create_engine(DATABASE_URL)
metadata = MetaData()

# Definición de la tabla de logs
logs_table = Table(
    "pump_logs",
    metadata,
    Column("timestamp_unix", Integer, primary_key=True), # Marca de tiempo
    Column("log_date", String), # Fecha
    Column("log_time", String), # Hora
    Column("discharge_pressure", Float), # [2]Presión de Descarga
    Column("discharge_pressure_unit", String), # [2]Unidad
    Column("start_pressure", Float), # [3]Presión de Arranque
    Column("start_pressure_unit", String), # [3]Unidad
    Column("stop_pressure", Float), # [4]Presión de Paro
    Column("stop_pressure_unit", String), # [4]Unidad
    Column("battery1_voltage", Float), # [5]Voltaje Bateria1
    Column("battery1_voltage_unit", String), # [5]Unidad
    Column("battery2_voltage", Float), # [6]Voltaje Bateria2
    Column("battery2_voltage_unit", String), # [6]Unidad
    Column("battery1_current", Float), # [7]Corriante Bateria1
    Column("battery1_current_unit", String), # [7]Unidad
    Column("battery2_current", Float), # [8]Corriante Bateria2
    Column("battery2_current_unit", String), # [8]Unidad
    Column("motor_running", Boolean), # [9]Motor en Marcha
    Column("support_running", Boolean), # [10]Apoyo en Marcha
    Column("event_id", String, nullable=True), # ID
    Column("message", String, nullable=True), # Mensaje
)

def create_table():
    """
    Crea la tabla pump_logs en la base de datos si no existe.
    """
    try:
        metadata.create_all(engine)
        print("Tabla 'pump_logs' creada o ya existente.")
    except Exception as e:
        print(f"Error al crear la tabla: {e}")

def insert_log_entry(log_data: dict):
    """
    Inserta una única entrada de log en la base de datos.
    """
    with engine.connect() as connection:
        trans = connection.begin()
        try:
            connection.execute(logs_table.insert(), log_data)
            trans.commit()
        except Exception as e:
            trans.rollback()
            print(f"Error al insertar log: {e}")

def bulk_insert_log_entries(log_entries: list[dict]):
    """
    Inserta múltiples entradas de log en la base de datos de forma eficiente.
    Utiliza ON CONFLICT DO NOTHING para evitar duplicados por timestamp_unix.
    """
    if not log_entries: # No hay entradas para insertar
        return

    # Convertir los valores booleanos a enteros (0 o 1) para PostgreSQL si es necesario
    # SQLAlchemy debería manejar esto, pero es una precaución si hay problemas.
    for entry in log_entries:
        if 'motor_running' in entry: 
            entry['motor_running'] = 1 if entry['motor_running'] else 0
        if 'support_running' in entry: 
            entry['support_running'] = 1 if entry['support_running'] else 0

    with engine.connect() as connection:
        trans = connection.begin()
        try:
            # Usar insert.on_conflict_do_nothing() para manejar duplicados
            insert_stmt = insert(logs_table).values(log_entries)
            do_nothing_stmt = insert_stmt.on_conflict_do_nothing(index_elements=['timestamp_unix'])
            connection.execute(do_nothing_stmt)
            trans.commit()
            print(f"Insertadas/Ignoradas {len(log_entries)} entradas de log.")
        except Exception as e:
            trans.rollback()
            print(f"Error en bulk insert de logs: {e}")

# Opcional: Crear la tabla al importar el módulo (útil para scripts de una sola vez)
# create_table()
