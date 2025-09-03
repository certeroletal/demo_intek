"""Configuración de inyección de dependencias."""

import os
from dotenv import load_dotenv
from ..adapters.secondary.persistence.memory.product_repository import (
    InMemoryProductRepository,
)
from ..adapters.secondary.persistence.postgresql.historical_data_repository import HistoricalDataRepository
from ..application.use_cases.product_service import ProductService
from ..application.use_cases.historical_data_service import HistoricalDataService
from ..domain.repositories.product_repository import ProductRepository


class DIContainer:
    """Contenedor de inyección de dependencias."""

    def __init__(self):
        self._instances = {}
        # Load environment variables from .env file
        load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '../../.env'))


    def get_product_repository(self) -> ProductRepository:
        """Obtiene la instancia del repositorio de productos."""
        if "product_repository" not in self._instances:
            self._instances["product_repository"] = InMemoryProductRepository()
        return self._instances["product_repository"]

    def get_product_service(self) -> ProductService:
        """Obtiene la instancia del servicio de productos."""
        if "product_service" not in self._instances:
            repository = self.get_product_repository()
            self._instances["product_service"] = ProductService(repository)
        return self._instances["product_service"]

    def get_historical_data_repository(self) -> HistoricalDataRepository:
        """Obtiene la instancia del repositorio de datos históricos."""
        if "historical_data_repository" not in self._instances:
            database_url = os.getenv("DATABASE_URL")
            if not database_url:
                raise ValueError("DATABASE_URL environment variable not set.")
            self._instances["historical_data_repository"] = HistoricalDataRepository(database_url)
        return self._instances["historical_data_repository"]

    def get_historical_data_service(self) -> HistoricalDataService:
        """Obtiene la instancia del servicio de datos históricos."""
        if "historical_data_service" not in self._instances:
            repository = self.get_historical_data_repository()
            self._instances["historical_data_service"] = HistoricalDataService(repository)
        return self._instances["historical_data_service"]


# Instancia global del contenedor
container = DIContainer()
