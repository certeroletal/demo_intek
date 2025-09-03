import os
import csv
import psycopg2
from urllib.parse import urlparse
from datetime import datetime
from pathlib import Path

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '../.env'))

def ingest_csv_data(csv_file_path):
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        print("Error: DATABASE_URL environment variable not set.")
        return

    result = urlparse(database_url)
    username = result.username
    password = result.password
    database = result.path[1:]
    hostname = result.hostname
    port = result.port

    conn = None
    try:
        conn = psycopg2.connect(
            host=hostname,
            port=port,
            database=database,
            user=username,
            password=password
        )
        cur = conn.cursor()

        with open(csv_file_path, 'r', encoding='utf-8-sig') as f:
            reader = csv.reader(f)
            header = next(reader)  # Skip header row

            # Prepare the INSERT statement
            insert_query = """
            INSERT INTO pump_data_logs (
                timestamp_unix, log_date, log_time, discharge_pressure, discharge_pressure_unit,
                start_pressure, start_pressure_unit, stop_pressure, stop_pressure_unit,
                battery1_voltage, battery1_voltage_unit, battery2_voltage, battery2_voltage_unit,
                battery1_current, battery1_current_unit, battery2_current, battery2_current_unit,
                motor_running, support_running, event_id, message
            ) VALUES (
                %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
            )
            ON CONFLICT (timestamp_unix) DO NOTHING;
            """

            for i, row in enumerate(reader):
                if not row:  # Skip empty rows
                    continue
                try:
                    # Data type conversion and cleaning
                    timestamp_unix = int(row[0])
                    log_date = datetime.strptime(row[1], '%Y.%m.%d').date()
                    log_time = datetime.strptime(row[2], '%H:%M:%S').time()
                    
                    # Handle potential empty strings for numeric values
                    discharge_pressure = float(row[3]) if row[3] else None
                    discharge_pressure_unit = row[4]
                    start_pressure = float(row[5]) if row[5] else None
                    start_pressure_unit = row[6]
                    stop_pressure = float(row[7]) if row[7] else None
                    stop_pressure_unit = row[8]
                    battery1_voltage = float(row[9]) if row[9] else None
                    battery1_voltage_unit = row[10]
                    battery2_voltage = float(row[11]) if row[11] else None
                    battery2_voltage_unit = row[12]
                    battery1_current = float(row[13]) if row[13] else None
                    battery1_current_unit = row[14]
                    battery2_current = float(row[15]) if row[15] else None
                    battery2_current_unit = row[16]
                    
                    motor_running = int(row[17]) if row[17] else None
                    support_running = int(row[18]) if row[18] else None
                    
                    event_id = row[19] if row[19] else None
                    message = row[20] if row[20] else None

                    data = (
                        timestamp_unix, log_date, log_time, discharge_pressure, discharge_pressure_unit,
                        start_pressure, start_pressure_unit, stop_pressure, stop_pressure_unit,
                        battery1_voltage, battery1_voltage_unit, battery2_voltage, battery2_voltage_unit,
                        battery1_current, battery1_current_unit, battery2_current, battery2_current_unit,
                        motor_running, support_running, event_id, message
                    )
                    cur.execute(insert_query, data)

                except (ValueError, IndexError) as e:
                    print(f"Skipping row {i+2} due to data error in {csv_file_path}: {e} - Row: {row}")
                    continue

            conn.commit()
            print(f"Successfully ingested data from {csv_file_path}")

    except Exception as e:
        print(f"Error ingesting data from {csv_file_path}: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    csv_files = [
        Path(__file__).parent.parent.parent / '01_docs' / 'documentacion_web' / 'logs.2024.01.csv',
        Path(__file__).parent.parent.parent / '01_docs' / 'documentacion_web' / 'logs.2024.02.csv',
        Path(__file__).parent.parent.parent / '01_docs' / 'documentacion_web' / 'logs.2024.03.csv',
    ]

    for csv_file in csv_files:
        if csv_file.exists():
            ingest_csv_data(str(csv_file))
        else:
            print(f"Error: CSV file not found at {csv_file}")
