"""Entidad de dominio para productos."""

from dataclasses import dataclass
from decimal import Decimal
from typing import Optional
from uuid import UUID, uuid4


@dataclass
class Product:
    """Entidad que representa un producto en el dominio."""

    id: UUID
    name: str
    description: str
    price: Decimal
    stock: int
    category: str
    is_active: bool = True

    @classmethod
    def create(cls, name: str, description: str, price: Decimal, stock: int, category: str) -> "Product":
        """Factory method para crear un nuevo producto."""
        return cls(
            id=uuid4(), name=name, description=description, price=price, stock=stock, category=category, is_active=True
        )

    def deactivate(self) -> None:
        """Desactiva el producto."""
        self.is_active = False

    def update_stock(self, new_stock: int) -> None:
        """Actualiza el stock del producto."""
        if new_stock < 0:
            raise ValueError("El stock no puede ser negativo")
        self.stock = new_stock

    def update_price(self, new_price: Decimal) -> None:
        """Actualiza el precio del producto."""
        if new_price <= 0:
            raise ValueError("El precio debe ser mayor que cero")
        self.price = new_price
