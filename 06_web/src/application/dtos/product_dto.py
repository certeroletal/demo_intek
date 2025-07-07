"""DTOs para operaciones con productos."""

from dataclasses import dataclass
from decimal import Decimal
from typing import List, Optional
from uuid import UUID


@dataclass
class CreateProductDto:
    """DTO para crear un producto."""

    name: str
    description: str
    price: Decimal
    stock: int
    category: str


@dataclass
class UpdateProductDto:
    """DTO para actualizar un producto."""

    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[Decimal] = None
    stock: Optional[int] = None
    category: Optional[str] = None


@dataclass
class ProductDto:
    """DTO de respuesta para un producto."""

    id: UUID
    name: str
    description: str
    price: Decimal
    stock: int
    category: str
    is_active: bool

    @classmethod
    def from_entity(cls, product) -> "ProductDto":
        """Convierte una entidad Product a DTO."""
        return cls(
            id=product.id,
            name=product.name,
            description=product.description,
            price=product.price,
            stock=product.stock,
            category=product.category,
            is_active=product.is_active,
        )


@dataclass
class ProductListDto:
    """DTO para lista de productos."""

    products: List[ProductDto]
    total: int
