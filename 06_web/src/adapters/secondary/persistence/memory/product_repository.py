"""Implementación en memoria del repositorio de productos."""

from typing import Dict, List, Optional
from uuid import UUID

from .....domain.entities.product import Product
from .....domain.repositories.product_repository import ProductRepository


class InMemoryProductRepository(ProductRepository):
    """Implementación en memoria del repositorio de productos."""

    def __init__(self):
        self._products: Dict[UUID, Product] = {}

    async def save(self, product: Product) -> None:
        """Guarda un producto."""
        self._products[product.id] = product

    async def find_by_id(self, product_id: UUID) -> Optional[Product]:
        """Busca un producto por ID."""
        return self._products.get(product_id)

    async def find_all(self) -> List[Product]:
        """Obtiene todos los productos."""
        return list(self._products.values())

    async def find_by_category(self, category: str) -> List[Product]:
        """Busca productos por categoría."""
        return [product for product in self._products.values() if product.category.lower() == category.lower()]

    async def delete(self, product_id: UUID) -> None:
        """Elimina un producto."""
        if product_id in self._products:
            del self._products[product_id]
