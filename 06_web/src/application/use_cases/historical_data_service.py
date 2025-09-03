from typing import List, Dict, Any, Tuple, Optional
from datetime import date, datetime, timedelta # Added datetime and timedelta
from src.adapters.secondary.persistence.postgresql.historical_data_repository import HistoricalDataRepository

class HistoricalDataService:
    def __init__(self, repository: HistoricalDataRepository):
        self.repository = repository

    def get_all_historical_data(self, page: int = 1, limit: int = 20) -> Tuple[List[Dict[str, Any]], int]:
        offset = (page - 1) * limit
        data = self.repository.get_all_pump_data_logs(offset=offset, limit=limit)
        total_count = self.repository.get_total_pump_data_logs_count()
        return data, total_count

    def get_historical_data_by_date_range(self, start_date: date, end_date: date, page: int = 1, limit: int = 20) -> Tuple[List[Dict[str, Any]], int]:
        offset = (page - 1) * limit
        data = self.repository.get_pump_data_logs_by_date_range(start_date, end_date, offset=offset, limit=limit)
        total_count = self.repository.get_total_pump_data_logs_count(start_date, end_date)
        return data, total_count

    def get_recent_historical_data(self, page: int = 1, limit: int = 20) -> Tuple[List[Dict[str, Any]], int]:
        offset = (page - 1) * limit
        end_datetime = datetime.now()
        # Fetch data for the last 12 hours
        start_datetime = end_datetime - timedelta(hours=12)
        interval_minutes = 5 # 1 status per 5 minutes

        data = self.repository.get_sampled_pump_data_logs(start_datetime, end_datetime, interval_minutes, offset, limit)
        total_count = self.repository.get_total_sampled_pump_data_logs_count(start_datetime, end_datetime, interval_minutes)
        return data, total_count

    def get_all_alarms(self) -> List[Dict[str, Any]]:
        return self.repository.get_all_alarms()

    def get_pressure_data_for_histogram(self, start_date: date, end_date: date) -> List[float]:
        return self.repository.get_pressure_data_by_date_range(start_date, end_date)