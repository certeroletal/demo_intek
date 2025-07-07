"""Configuración de inyección de dependencias."""

from ..adapters.secondary.persistence.memory.product_repository import (
    InMemoryProductRepository,
)
from ..application.use_cases.product_service import ProductService
from ..domain.repositories.product_repository import ProductRepository


class DIContainer:
    """Contenedor de inyección de dependencias."""

    def __init__(self):
        self._instances = {}

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


# Instancia global del contenedor
container = DIContainer()
