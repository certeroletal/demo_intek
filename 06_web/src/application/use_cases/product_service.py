"""Casos de uso para gestión de productos."""

from typing import List, Optional
from uuid import UUID

from ...domain.entities.product import Product
from ...domain.repositories.product_repository import ProductRepository
from ..dtos.product_dto import (
    CreateProductDto,
    ProductDto,
    ProductListDto,
    UpdateProductDto,
)


class ProductService:
    """Servicio de aplicación para gestión de productos."""

    def __init__(self, product_repository: ProductRepository):
        self._product_repository = product_repository

    async def create_product(self, create_dto: CreateProductDto) -> ProductDto:
        """Crea un nuevo producto."""
        product = Product.create(
            name=create_dto.name,
            description=create_dto.description,
            price=create_dto.price,
            stock=create_dto.stock,
            category=create_dto.category,
        )

        await self._product_repository.save(product)
        return ProductDto.from_entity(product)

    async def get_product_by_id(self, product_id: UUID) -> Optional[ProductDto]:
        """Obtiene un producto por ID."""
        product = await self._product_repository.find_by_id(product_id)
        if not product:
            return None
        return ProductDto.from_entity(product)

    async def get_all_products(self) -> ProductListDto:
        """Obtiene todos los productos."""
        products = await self._product_repository.find_all()
        product_dtos = [ProductDto.from_entity(p) for p in products]
        return ProductListDto(products=product_dtos, total=len(product_dtos))

    async def get_products_by_category(self, category: str) -> ProductListDto:
        """Obtiene productos por categoría."""
        products = await self._product_repository.find_by_category(category)
        product_dtos = [ProductDto.from_entity(p) for p in products]
        return ProductListDto(products=product_dtos, total=len(product_dtos))

    async def update_product(self, product_id: UUID, update_dto: UpdateProductDto) -> Optional[ProductDto]:
        """Actualiza un producto."""
        product = await self._product_repository.find_by_id(product_id)
        if not product:
            return None

        if update_dto.name is not None:
            product.name = update_dto.name
        if update_dto.description is not None:
            product.description = update_dto.description
        if update_dto.price is not None:
            product.update_price(update_dto.price)
        if update_dto.stock is not None:
            product.update_stock(update_dto.stock)
        if update_dto.category is not None:
            product.category = update_dto.category

        await self._product_repository.save(product)
        return ProductDto.from_entity(product)

    async def delete_product(self, product_id: UUID) -> bool:
        """Elimina un producto."""
        product = await self._product_repository.find_by_id(product_id)
        if not product:
            return False

        await self._product_repository.delete(product_id)
        return True

    async def deactivate_product(self, product_id: UUID) -> Optional[ProductDto]:
        """Desactiva un producto."""
        product = await self._product_repository.find_by_id(product_id)
        if not product:
            return None

        product.deactivate()
        await self._product_repository.save(product)
        return ProductDto.from_entity(product)
