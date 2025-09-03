import os
import psycopg2
from urllib.parse import urlparse

def create_pump_data_logs_table():
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

        create_table_query = """
        CREATE TABLE IF NOT EXISTS pump_data_logs (
            timestamp_unix BIGINT PRIMARY KEY,
            log_date DATE,
            log_time TIME,
            discharge_pressure REAL,
            discharge_pressure_unit VARCHAR(10),
            start_pressure REAL,
            start_pressure_unit VARCHAR(10),
            stop_pressure REAL,
            stop_pressure_unit VARCHAR(10),
            battery1_voltage REAL,
            battery1_voltage_unit VARCHAR(10),
            battery2_voltage REAL,
            battery2_voltage_unit VARCHAR(10),
            battery1_current REAL,
            battery1_current_unit VARCHAR(10),
            battery2_current REAL,
            battery2_current_unit VARCHAR(10),
            motor_running SMALLINT,
            support_running SMALLINT,
            event_id VARCHAR(50),
            message TEXT
        );
        """
        cur.execute(create_table_query)
        conn.commit()
        print("Table 'pump_data_logs' created successfully (if it didn't exist).")
        cur.close()
    except Exception as e:
        print(f"Error creating table: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    # Load environment variables from .env file
    from dotenv import load_dotenv
    load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '../.env'))
    create_pump_data_logs_table()
