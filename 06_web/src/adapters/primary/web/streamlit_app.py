"""Adaptador principal de Streamlit para la aplicación de gestión de productos."""

import asyncio
from decimal import Decimal
from typing import Optional
from uuid import UUID

import streamlit as st

from ....adapters.secondary.persistence.memory.product_repository import (
    InMemoryProductRepository,
)
from ....application.dtos.product_dto import CreateProductDto, UpdateProductDto
from ....application.use_cases.product_service import ProductService


class StreamlitProductApp:
    """Aplicación principal de Streamlit para gestión de productos."""

    def __init__(self):
        # Configuración de la página
        st.set_page_config(
            page_title="Gestión de Productos", page_icon="📦", layout="wide", initial_sidebar_state="expanded"
        )

        # Inicialización del servicio si no existe en session_state
        if "product_service" not in st.session_state:
            repository = InMemoryProductRepository()
            st.session_state.product_service = ProductService(repository)

        self.product_service: ProductService = st.session_state.product_service

    def run(self):
        """Ejecuta la aplicación Streamlit."""
        st.title("🛍️ Sistema de Gestión de Productos")
        st.markdown("---")

        # Sidebar para navegación
        with st.sidebar:
            st.header("📋 Navegación")
            page = st.selectbox(
                "Selecciona una página:",
                ["📊 Dashboard", "➕ Crear Producto", "📝 Gestionar Productos", "📈 Estadísticas"],
            )

        # Enrutamiento de páginas
        if page == "📊 Dashboard":
            self._show_dashboard()
        elif page == "➕ Crear Producto":
            self._show_create_product()
        elif page == "📝 Gestionar Productos":
            self._show_manage_products()
        elif page == "📈 Estadísticas":
            self._show_statistics()

    def _show_dashboard(self):
        """Muestra el dashboard principal."""
        st.header("📊 Dashboard de Productos")

        # Obtener todos los productos
        products_data = asyncio.run(self.product_service.get_all_products())

        # Métricas principales
        col1, col2, col3, col4 = st.columns(4)

        with col1:
            st.metric(label="Total de Productos", value=products_data.total, delta=None)

        with col2:
            active_products = sum(1 for p in products_data.products if p.is_active)
            st.metric(label="Productos Activos", value=active_products, delta=None)

        with col3:
            total_stock = sum(p.stock for p in products_data.products)
            st.metric(label="Stock Total", value=total_stock, delta=None)

        with col4:
            if products_data.products:
                avg_price = sum(float(p.price) for p in products_data.products) / len(products_data.products)
                st.metric(label="Precio Promedio", value=f"${avg_price:.2f}", delta=None)
            else:
                st.metric(label="Precio Promedio", value="$0.00")

        st.markdown("---")

        # Lista de productos
        if products_data.products:
            st.subheader("📦 Productos Recientes")

            for product in products_data.products[-5:]:  # Últimos 5 productos
                with st.expander(f"{product.name} - ${product.price}"):
                    col1, col2 = st.columns(2)
                    with col1:
                        st.write(f"**Descripción:** {product.description}")
                        st.write(f"**Categoría:** {product.category}")
                    with col2:
                        st.write(f"**Stock:** {product.stock}")
                        st.write(f"**Estado:** {'✅ Activo' if product.is_active else '❌ Inactivo'}")
        else:
            st.info("No hay productos registrados. ¡Crea tu primer producto!")

    def _show_create_product(self):
        """Muestra el formulario para crear productos."""
        st.header("➕ Crear Nuevo Producto")

        with st.form("create_product_form"):
            st.subheader("Información del Producto")

            col1, col2 = st.columns(2)

            with col1:
                name = st.text_input("Nombre del Producto*", placeholder="Ej: iPhone 15")
                category = st.selectbox(
                    "Categoría*", ["Electrónicos", "Ropa", "Libros", "Hogar", "Deportes", "Juguetes", "Otros"]
                )
                price = st.number_input("Precio*", min_value=0.01, value=1.00, step=0.01, format="%.2f")

            with col2:
                description = st.text_area(
                    "Descripción*", placeholder="Describe las características principales del producto..."
                )
                stock = st.number_input("Stock Inicial*", min_value=0, value=1, step=1)

            submitted = st.form_submit_button("🚀 Crear Producto", use_container_width=True)

            if submitted:
                if not name or not description:
                    st.error("❌ Todos los campos marcados con * son obligatorios")
                else:
                    try:
                        create_dto = CreateProductDto(
                            name=name,
                            description=description,
                            price=Decimal(str(price)),
                            stock=stock,
                            category=category,
                        )

                        new_product = asyncio.run(self.product_service.create_product(create_dto))

                        st.success(f"✅ Producto '{new_product.name}' creado exitosamente!")
                        st.balloons()

                        # Mostrar información del producto creado
                        with st.expander("📋 Detalles del producto creado"):
                            st.json(
                                {
                                    "ID": str(new_product.id),
                                    "Nombre": new_product.name,
                                    "Descripción": new_product.description,
                                    "Precio": f"${new_product.price}",
                                    "Stock": new_product.stock,
                                    "Categoría": new_product.category,
                                }
                            )

                    except Exception as e:
                        st.error(f"❌ Error al crear el producto: {str(e)}")

    def _show_manage_products(self):
        """Muestra la página de gestión de productos."""
        st.header("📝 Gestionar Productos")

        # Obtener todos los productos
        products_data = asyncio.run(self.product_service.get_all_products())

        if not products_data.products:
            st.info("No hay productos para gestionar. ¡Crea tu primer producto!")
            return

        # Filtros
        col1, col2 = st.columns(2)
        with col1:
            categories = list(set(p.category for p in products_data.products))
            selected_category = st.selectbox("Filtrar por categoría:", ["Todas"] + categories)

        with col2:
            show_inactive = st.checkbox("Mostrar productos inactivos", value=True)

        # Filtrar productos
        filtered_products = products_data.products
        if selected_category != "Todas":
            filtered_products = [p for p in filtered_products if p.category == selected_category]
        if not show_inactive:
            filtered_products = [p for p in filtered_products if p.is_active]

        st.markdown("---")

        # Mostrar productos en tarjetas
        for i, product in enumerate(filtered_products):
            with st.container():
                col1, col2, col3, col4 = st.columns([3, 2, 2, 2])

                with col1:
                    status_icon = "✅" if product.is_active else "❌"
                    st.write(f"### {status_icon} {product.name}")
                    st.write(f"**Descripción:** {product.description}")
                    st.write(f"**Categoría:** {product.category}")

                with col2:
                    st.write(f"**Precio:** ${product.price}")
                    st.write(f"**Stock:** {product.stock}")

                with col3:
                    if st.button(f"✏️ Editar", key=f"edit_{product.id}"):
                        st.session_state[f"editing_{product.id}"] = True

                with col4:
                    if product.is_active:
                        if st.button(f"🚫 Desactivar", key=f"deactivate_{product.id}"):
                            asyncio.run(self.product_service.deactivate_product(product.id))
                            st.success(f"Producto '{product.name}' desactivado")
                            st.rerun()

                    if st.button(f"🗑️ Eliminar", key=f"delete_{product.id}"):
                        if asyncio.run(self.product_service.delete_product(product.id)):
                            st.success(f"Producto '{product.name}' eliminado")
                            st.rerun()

                # Formulario de edición
                if st.session_state.get(f"editing_{product.id}", False):
                    with st.form(f"edit_form_{product.id}"):
                        st.subheader(f"Editar: {product.name}")

                        edit_col1, edit_col2 = st.columns(2)

                        with edit_col1:
                            new_name = st.text_input("Nombre", value=product.name, key=f"name_{product.id}")
                            new_price = st.number_input(
                                "Precio",
                                min_value=0.01,
                                value=float(product.price),
                                step=0.01,
                                key=f"price_{product.id}",
                            )

                        with edit_col2:
                            new_stock = st.number_input(
                                "Stock", min_value=0, value=product.stock, key=f"stock_{product.id}"
                            )
                            new_category = st.selectbox(
                                "Categoría",
                                ["Electrónicos", "Ropa", "Libros", "Hogar", "Deportes", "Juguetes", "Otros"],
                                index=(
                                    ["Electrónicos", "Ropa", "Libros", "Hogar", "Deportes", "Juguetes", "Otros"].index(
                                        product.category
                                    )
                                    if product.category
                                    in ["Electrónicos", "Ropa", "Libros", "Hogar", "Deportes", "Juguetes", "Otros"]
                                    else 6
                                ),
                                key=f"category_{product.id}",
                            )

                        new_description = st.text_area(
                            "Descripción", value=product.description, key=f"desc_{product.id}"
                        )

                        button_col1, button_col2 = st.columns(2)

                        with button_col1:
                            if st.form_submit_button("💾 Guardar Cambios"):
                                try:
                                    update_dto = UpdateProductDto(
                                        name=new_name,
                                        description=new_description,
                                        price=Decimal(str(new_price)),
                                        stock=new_stock,
                                        category=new_category,
                                    )

                                    updated_product = asyncio.run(
                                        self.product_service.update_product(product.id, update_dto)
                                    )

                                    if updated_product:
                                        st.success("✅ Producto actualizado exitosamente!")
                                        st.session_state[f"editing_{product.id}"] = False
                                        st.rerun()
                                    else:
                                        st.error("❌ Error al actualizar el producto")

                                except Exception as e:
                                    st.error(f"❌ Error: {str(e)}")

                        with button_col2:
                            if st.form_submit_button("❌ Cancelar"):
                                st.session_state[f"editing_{product.id}"] = False
                                st.rerun()

                st.markdown("---")

    def _show_statistics(self):
        """Muestra estadísticas de los productos."""
        st.header("📈 Estadísticas de Productos")

        products_data = asyncio.run(self.product_service.get_all_products())

        if not products_data.products:
            st.info("No hay datos suficientes para mostrar estadísticas.")
            return

        # Análisis por categoría
        st.subheader("📊 Distribución por Categoría")

        category_count = {}
        category_value = {}

        for product in products_data.products:
            category = product.category
            category_count[category] = category_count.get(category, 0) + 1
            category_value[category] = category_value.get(category, 0) + float(product.price) * product.stock

        col1, col2 = st.columns(2)

        with col1:
            st.write("**Cantidad de productos por categoría:**")
            for category, count in category_count.items():
                st.write(f"- {category}: {count} productos")

        with col2:
            st.write("**Valor total de inventario por categoría:**")
            for category, value in category_value.items():
                st.write(f"- {category}: ${value:.2f}")

        st.markdown("---")

        # Productos con bajo stock
        st.subheader("⚠️ Productos con Bajo Stock")
        low_stock_products = [p for p in products_data.products if p.stock < 10]

        if low_stock_products:
            for product in low_stock_products:
                st.warning(f"📦 {product.name}: Solo {product.stock} unidades en stock")
        else:
            st.success("✅ Todos los productos tienen stock suficiente")


def main():
    """Función principal para ejecutar la aplicación."""
    app = StreamlitProductApp()
    app.run()


if __name__ == "__main__":
    main()
