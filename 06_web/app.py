#!/usr/bin/env python3
"""Punto de entrada principal para la aplicación Streamlit."""

import sys
from pathlib import Path

# Agregar el directorio src al path
src_path = Path(__file__).parent / "src"
sys.path.insert(0, str(src_path))

from src.adapters.primary.web.streamlit_app import main

if __name__ == "__main__":
    main()
