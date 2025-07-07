#!/bin/bash
# Script para crear la estructura de carpetas y archivos base siguiendo arquitectura hexagonal
# Subproyectos: adm, ops, web, raspb

set -e

BASE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Carpetas y archivos del proyecto raíz
mkdir -p "$BASE_DIR/.devcontainer/adm" "$BASE_DIR/.devcontainer/ops" "$BASE_DIR/.devcontainer/web" "$BASE_DIR/.devcontainer/raspb"
touch "$BASE_DIR/.devcontainer/adm/devcontainer.json"
touch "$BASE_DIR/.devcontainer/ops/devcontainer.json"
touch "$BASE_DIR/.devcontainer/web/devcontainer.json"
touch "$BASE_DIR/.devcontainer/raspb/devcontainer.json"

mkdir -p "$BASE_DIR/.github/instructions" "$BASE_DIR/.github/prompts" "$BASE_DIR/.github/workflows"
touch "$BASE_DIR/.github/copilot-instructions.md"

mkdir -p "$BASE_DIR/01_docs/application" "$BASE_DIR/01_docs/architecture/adrs" "$BASE_DIR/01_docs/data" "$BASE_DIR/01_docs/templates"
touch "$BASE_DIR/01_docs/application/background.md"
touch "$BASE_DIR/01_docs/application/brief.md"
touch "$BASE_DIR/01_docs/application/requirements.md"
touch "$BASE_DIR/01_docs/application/wbs.md"
touch "$BASE_DIR/01_docs/architecture/adrs/0001-inicial.md"
touch "$BASE_DIR/01_docs/architecture/adrs/0002-otra-decision.md"
touch "$BASE_DIR/01_docs/data/data_dict.md"
touch "$BASE_DIR/01_docs/templates/architecture_template.md"
touch "$BASE_DIR/01_docs/templates/background_template.md"
touch "$BASE_DIR/01_docs/templates/brief_template.md"
touch "$BASE_DIR/01_docs/templates/data_dict_template.md"
touch "$BASE_DIR/01_docs/templates/requirements_template.md"
touch "$BASE_DIR/01_docs/templates/wbs_template.md"

mkdir -p "$BASE_DIR/02_models/application/class" "$BASE_DIR/02_models/application/sequence" "$BASE_DIR/02_models/architecture" "$BASE_DIR/02_models/datos/entity_relationship"
touch "$BASE_DIR/02_models/architecture/c4.dsl"

# Subproyectos
for sub in adm ops web raspb; do
  case $sub in
    adm) idx=4;;
    ops) idx=5;;
    web) idx=6;;
    raspb) idx=7;;
  esac
  SUB_DIR="$BASE_DIR/0${idx}_${sub}"
  mkdir -p "$SUB_DIR/docs/application" "$SUB_DIR/docs/architecture/adrs" "$SUB_DIR/docs/data" "$SUB_DIR/docs/templates"
  mkdir -p "$SUB_DIR/models/application/class" "$SUB_DIR/models/application/sequence" "$SUB_DIR/models/architecture" "$SUB_DIR/models/datos/entity_relationship"
  mkdir -p "$SUB_DIR/scripts"
  mkdir -p "$SUB_DIR/src/adapters/primary/api/fastapi/v1" "$SUB_DIR/src/adapters/primary/cli" "$SUB_DIR/src/adapters/primary/web" "$SUB_DIR/src/adapters/secondary/external_apis" "$SUB_DIR/src/adapters/secondary/messaging" "$SUB_DIR/src/adapters/secondary/persistence/cloud_storage" "$SUB_DIR/src/adapters/secondary/persistence/databases" "$SUB_DIR/src/adapters/secondary/persistence/memory"
  mkdir -p "$SUB_DIR/src/application/dtos" "$SUB_DIR/src/application/exceptions" "$SUB_DIR/src/application/handlers" "$SUB_DIR/src/application/ports/primary" "$SUB_DIR/src/application/ports/secondary" "$SUB_DIR/src/application/use_cases"
  mkdir -p "$SUB_DIR/src/config"
  mkdir -p "$SUB_DIR/src/domain/entities" "$SUB_DIR/src/domain/events" "$SUB_DIR/src/domain/exceptions" "$SUB_DIR/src/domain/repositories" "$SUB_DIR/src/domain/services" "$SUB_DIR/src/domain/value_objects"
  mkdir -p "$SUB_DIR/tests/functional" "$SUB_DIR/tests/integration" "$SUB_DIR/tests/unit"
  touch "$SUB_DIR/scripts/deploy.py" "$SUB_DIR/scripts/setup.py" "$SUB_DIR/scripts/utils.py"
  touch "$SUB_DIR/.env" "$SUB_DIR/.gitignore" "$SUB_DIR/Dockerfile" "$SUB_DIR/Makefile" "$SUB_DIR/README.md" "$SUB_DIR/pyproject.toml"
  touch "$SUB_DIR/src/config/config-development.yaml" "$SUB_DIR/src/config/config-production.yaml" "$SUB_DIR/src/config/config-qa.yaml" "$SUB_DIR/src/config/di_config.py" "$SUB_DIR/src/config/loader.py" "$SUB_DIR/src/config/log_config.py"
done

touch "$BASE_DIR/.gitignore"
touch "$BASE_DIR/docker-compose.yaml"
touch "$BASE_DIR/Makefile"
touch "$BASE_DIR/README.md"

echo "Estructura creada correctamente."
