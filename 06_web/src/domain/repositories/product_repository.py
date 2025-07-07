"""Interfaz del repositorio de productos."""

from abc import ABC, abstractmethod
from typing import List, Optional
from uuid import UUID

from ..entities.product import Product


class ProductRepository(ABC):
    """Interfaz del repositorio de productos."""

    @abstractmethod
    async def save(self, product: Product) -> None:
        """Guarda un producto."""
        pass

    @abstractmethod
    async def find_by_id(self, product_id: UUID) -> Optional[Product]:
        """Busca un producto por ID."""
        pass

    @abstractmethod
    async def find_all(self) -> List[Product]:
        """Obtiene todos los productos."""
        pass

    @abstractmethod
    async def find_by_category(self, category: str) -> List[Product]:
        """Busca productos por categoría."""
        pass

    @abstractmethod
    async def delete(self, product_id: UUID) -> None:
        """Elimina un producto."""
        pass
