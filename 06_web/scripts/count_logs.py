import os
import psycopg2
from urllib.parse import urlparse

# Load environment variables from .env file
from dotenv import load_dotenv
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '../.env'))

def count_pump_data_logs():
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

        cur.execute("SELECT COUNT(*) FROM pump_data_logs;")
        count = cur.fetchone()[0]
        print(f"Total rows in pump_data_logs: {count}")
        cur.close()
    except Exception as e:
        print(f"Error counting rows: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    count_pump_data_logs()
