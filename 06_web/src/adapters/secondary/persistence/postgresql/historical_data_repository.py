import psycopg2
from urllib.parse import urlparse
from datetime import date, time, datetime
from typing import List, Dict, Any, Optional

class HistoricalDataRepository:
    def __init__(self, database_url: str):
        self.database_url = database_url

    def _get_connection(self):
        result = urlparse(self.database_url)
        username = result.username
        password = result.password
        database = result.path[1:]
        hostname = result.hostname
        port = result.port
        return psycopg2.connect(
            host=hostname,
            port=port,
            database=database,
            user=username,
            password=password
        )

    def get_total_pump_data_logs_count(self, start_date: Optional[date] = None, end_date: Optional[date] = None) -> int:
        conn = None
        try:
            conn = self._get_connection()
            cur = conn.cursor()
            if start_date and end_date:
                cur.execute("SELECT COUNT(*) FROM pump_data_logs WHERE log_date BETWEEN %s AND %s;", (start_date, end_date))
            else:
                cur.execute("SELECT COUNT(*) FROM pump_data_logs;")
            count = cur.fetchone()[0]
            cur.close()
            return count
        except Exception as e:
            print(f"Error fetching total pump data logs count: {e}")
            return 0
        finally:
            if conn:
                conn.close()

    def get_all_pump_data_logs(self, offset: int = 0, limit: int = 20) -> List[Dict[str, Any]]:
        conn = None
        try:
            conn = self._get_connection()
            cur = conn.cursor()
            cur.execute(
                "SELECT * FROM pump_data_logs ORDER BY timestamp_unix ASC OFFSET %s LIMIT %s;",
                (offset, limit)
            )
            columns = [desc[0] for desc in cur.description]
            data = []
            for row in cur.fetchall():
                data.append(dict(zip(columns, row)))
            cur.close()
            return data
        except Exception as e:
            print(f"Error fetching historical pump data: {e}")
            return []
        finally:
            if conn:
                conn.close()

    def get_all_pump_data_logs_unpaginated(self) -> List[Dict[str, Any]]:
        conn = None
        try:
            conn = self._get_connection()
            cur = conn.cursor()
            cur.execute(
                "SELECT * FROM pump_data_logs ORDER BY timestamp_unix ASC;"
            )
            columns = [desc[0] for desc in cur.description]
            data = []
            for row in cur.fetchall():
                data.append(dict(zip(columns, row)))
            cur.close()
            return data
        except Exception as e:
            print(f"Error fetching all unpaginated pump data logs: {e}")
            return []
        finally:
            if conn:
                conn.close()

    def get_pump_data_logs_by_date_range(self, start_date: date, end_date: date, offset: int = 0, limit: int = 20) -> List[Dict[str, Any]]:
        conn = None
        try:
            conn = self._get_connection()
            cur = conn.cursor()
            cur.execute(
                "SELECT * FROM pump_data_logs WHERE log_date BETWEEN %s AND %s ORDER BY timestamp_unix ASC OFFSET %s LIMIT %s;",
                (start_date, end_date, offset, limit)
            )
            columns = [desc[0] for desc in cur.description]
            data = []
            for row in cur.fetchall():
                data.append(dict(zip(columns, row)))
            cur.close()
            return data
        except Exception as e:
            print(f"Error fetching historical pump data by date range: {e}")
            return []
        finally:
            if conn:
                conn.close()

    def get_sampled_pump_data_logs(self, start_datetime: datetime, end_datetime: datetime, interval_minutes: int = 30, offset: int = 0, limit: int = 20) -> List[Dict[str, Any]]:
        conn = None
        try:
            conn = self._get_connection()
            cur = conn.cursor()
            # SQL to sample data every 'interval_minutes'
            # This is a common way to sample time-series data in PostgreSQL
            query = f"""
            SELECT DISTINCT ON (time_bucket)
                timestamp_unix, log_date, log_time, discharge_pressure, discharge_pressure_unit,
                start_pressure, start_pressure_unit, stop_pressure, stop_pressure_unit,
                battery1_voltage, battery1_voltage_unit, battery2_voltage, battery2_voltage_unit,
                battery1_current, battery1_current_unit, battery2_current, battery2_current_unit,
                motor_running, support_running, event_id, message
            FROM (
                SELECT
                    *,
                    time_bucket('{interval_minutes} minutes', to_timestamp(timestamp_unix)) AS time_bucket
                FROM pump_data_logs
                WHERE to_timestamp(timestamp_unix) BETWEEN %s AND %s
            ) AS sampled_data
            ORDER BY time_bucket, timestamp_unix ASC
            OFFSET %s LIMIT %s;
            """
            cur.execute(query, (start_datetime, end_datetime, offset, limit))
            columns = [desc[0] for desc in cur.description]
            data = []
            for row in cur.fetchall():
                data.append(dict(zip(columns, row)))
            cur.close()
            return data
        except Exception as e:
            print(f"Error fetching sampled pump data: {e}")
            return []
        finally:
            if conn:
                conn.close()

    def get_total_sampled_pump_data_logs_count(self, start_datetime: datetime, end_datetime: datetime, interval_minutes: int = 30) -> int:
        conn = None
        try:
            conn = self._get_connection()
            cur = conn.cursor()
            query = f"""
            SELECT COUNT(DISTINCT time_bucket)
            FROM (
                SELECT
                    time_bucket('{interval_minutes} minutes', to_timestamp(timestamp_unix)) AS time_bucket
                FROM pump_data_logs
                WHERE to_timestamp(timestamp_unix) BETWEEN %s AND %s
            ) AS sampled_data;
            """
            cur.execute(query, (start_datetime, end_datetime))
            count = cur.fetchone()[0]
            cur.close()
            return count
        except Exception as e:
            print(f"Error fetching total sampled pump data logs count: {e}")
            return 0
        finally:
            if conn:
                conn.close()

    def get_all_alarms(self) -> List[Dict[str, Any]]:
        conn = None
        try:
            conn = self._get_connection()
            cur = conn.cursor()
            cur.execute(
                "SELECT timestamp_unix, log_date, log_time, event_id, message FROM pump_data_logs WHERE event_id IS NOT NULL ORDER BY timestamp_unix DESC;"
            )
            columns = [desc[0] for desc in cur.description]
            data = []
            for row in cur.fetchall():
                data.append(dict(zip(columns, row)))
            cur.close()
            return data
        except Exception as e:
            print(f"Error fetching all alarms: {e}")
            return []
        finally:
            if conn:
                conn.close()

    def get_pressure_data_by_date_range(self, start_date: date, end_date: date) -> List[float]:
        conn = None
        try:
            conn = self._get_connection()
            cur = conn.cursor()
            cur.execute(
                "SELECT discharge_pressure FROM pump_data_logs WHERE log_date BETWEEN %s AND %s;",
                (start_date, end_date)
            )
            data = [row[0] for row in cur.fetchall()]
            cur.close()
            return data
        except Exception as e:
            print(f"Error fetching pressure data by date range: {e}")
            return []
        finally:
            if conn:
                conn.close()