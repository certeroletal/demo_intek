#!/usr/bin/env python3
"""Script para inicializar la aplicación con datos de ejemplo."""

import asyncio
import sys
from decimal import Decimal
from pathlib import Path

# Agregar el directorio src al path
src_path = Path(__file__).parent / "src"
sys.path.insert(0, str(src_path))

from src.application.dtos.product_dto import CreateProductDto
from src.config.di_config import container


async def initialize_sample_data():
    """Inicializa la aplicación con datos de ejemplo."""
    product_service = container.get_product_service()

    # Productos de ejemplo
    sample_products = [
        CreateProductDto(
            name="iPhone 15 Pro",
            description="Smartphone Apple con chip A17 Pro, cámara de 48MP y pantalla Super Retina XDR",
            price=Decimal("999.99"),
            stock=25,
            category="Electrónicos",
        ),
        CreateProductDto(
            name="MacBook Air M3",
            description="Laptop ultraligera con chip M3, 8GB RAM y 256GB SSD",
            price=Decimal("1199.00"),
            stock=15,
            category="Electrónicos",
        ),
        CreateProductDto(
            name="Camiseta Nike Dri-FIT",
            description="Camiseta deportiva con tecnología Dri-FIT para absorber el sudor",
            price=Decimal("29.99"),
            stock=50,
            category="Ropa",
        ),
        CreateProductDto(
            name="Libro: Clean Architecture",
            description="Guía para crear software mantenible por Robert C. Martin",
            price=Decimal("45.99"),
            stock=30,
            category="Libros",
        ),
        CreateProductDto(
            name="Pelota de Fútbol Nike",
            description="Pelota oficial FIFA con diseño aerodinámico",
            price=Decimal("89.99"),
            stock=20,
            category="Deportes",
        ),
        CreateProductDto(
            name="Juego LEGO Technic",
            description="Set de construcción LEGO para edades 10+ con 500 piezas",
            price=Decimal("79.99"),
            stock=12,
            category="Juguetes",
        ),
        CreateProductDto(
            name="Cafetera Nespresso",
            description="Cafetera automática con cápsulas, incluye 10 cápsulas de cortesía",
            price=Decimal("149.99"),
            stock=8,
            category="Hogar",
        ),
        CreateProductDto(
            name='Monitor Gaming 27"',
            description="Monitor gaming 144Hz, 1ms, resolución 2K con tecnología AMD FreeSync",
            price=Decimal("329.99"),
            stock=18,
            category="Electrónicos",
        ),
        CreateProductDto(
            name="Zapatillas Running Adidas",
            description="Zapatillas para correr con tecnología Boost y suela Continental",
            price=Decimal("139.99"),
            stock=35,
            category="Ropa",
        ),
        CreateProductDto(
            name="Libro: Python para Todos",
            description="Aprende programación en Python desde cero hasta nivel avanzado",
            price=Decimal("39.99"),
            stock=22,
            category="Libros",
        ),
    ]

    print("🚀 Inicializando datos de ejemplo...")

    for product_dto in sample_products:
        try:
            created_product = await product_service.create_product(product_dto)
            print(f"✅ Producto creado: {created_product.name}")
        except Exception as e:
            print(f"❌ Error al crear producto {product_dto.name}: {e}")

    print(f"\n🎉 Inicialización completada! Se crearon {len(sample_products)} productos de ejemplo.")
    print("📱 Ahora puedes ejecutar la aplicación con: streamlit run app.py")


if __name__ == "__main__":
    asyncio.run(initialize_sample_data())
