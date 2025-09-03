
import csv
import os
from datetime import datetime
from src.domain.repositories import log_repository

# Ruta a la carpeta donde se encuentran los archivos CSV
LOGS_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "01_docs", "documentacion_web")

def parse_csv_row(row: dict) -> dict:
    """
    Parsea una fila de CSV y la convierte a un diccionario compatible con la tabla pump_logs.
    """
    parsed_data = {
        "timestamp_unix": int(row['Marca de tiempo']),
        "log_date": row['Fecha'],
        "log_time": row['Hora'],
        "discharge_pressure": float(row['[2]Presión de Descarga']),
        "discharge_pressure_unit": row['[2]Unidad'].replace('[1:1]', ''),
        "start_pressure": float(row['[3]Presión de Arranque']),
        "start_pressure_unit": row['[3]Unidad'].replace('[1:1]', ''),
        "stop_pressure": float(row['[4]Presión de Paro']),
        "stop_pressure_unit": row['[4]Unidad'].replace('[1:1]', ''),
        "battery1_voltage": float(row['[5]Voltaje Bateria1']),
        "battery1_voltage_unit": row['[5]Unidad'].replace('[3:1]', ''),
        "battery2_voltage": float(row['[6]Voltaje Bateria2']),
        "battery2_voltage_unit": row['[6]Unidad'].replace('[3:1]', ''),
        "battery1_current": float(row['[7]Corriante Bateria1']),
        "battery1_current_unit": row['[7]Unidad'].replace('[4:1]', ''),
        "battery2_current": float(row['[8]Corriante Bateria2']),
        "battery2_current_unit": row['[8]Unidad'].replace('[4:1]', ''),
        "motor_running": bool(int(row['[9]Motor en Marcha'])),
        "support_running": bool(int(row['[10]Apoyo en Marcha'])),
        "event_id": row['ID'] if 'ID' in row else None,
        "message": row['Mensaje'] if 'Mensaje' in row else None,
    }
    return parsed_data

def ingest_logs():
    """
    Lee todos los archivos CSV de logs y los ingesta en la base de datos.
    """
    print(f"Iniciando ingesta de logs desde: {LOGS_DIR}")
    log_repository.create_table() # Asegurarse de que la tabla exista

    csv_files = [f for f in os.listdir(LOGS_DIR) if f.endswith('.csv')]
    csv_files.sort() # Procesar en orden cronológico si los nombres lo permiten

    total_entries_ingested = 0
    for filename in csv_files:
        filepath = os.path.join(LOGS_DIR, filename)
        print(f"Procesando archivo: {filename}")
        batch = []
        with open(filepath, mode='r', encoding='utf-8') as file:
            reader = csv.DictReader(file)
            for row in reader:
                try:
                    parsed_row = parse_csv_row(row)
                    batch.append(parsed_row)
                    if len(batch) >= 1000: # Insertar en lotes de 1000
                        log_repository.bulk_insert_log_entries(batch)
                        total_entries_ingested += len(batch)
                        batch = []
                except Exception as e:
                    print(f"Error al parsear fila en {filename}: {row} - {e}")
        
        # Insertar cualquier fila restante en el último lote
        if batch:
            log_repository.bulk_insert_log_entries(batch)
            total_entries_ingested += len(batch)

    print(f"Ingesta de logs completada. Total de entradas procesadas: {total_entries_ingested}")

if __name__ == "__main__":
    ingest_logs()
