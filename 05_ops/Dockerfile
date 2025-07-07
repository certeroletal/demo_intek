# ==============================================================================
# ETL-ENGINE DOCKERFILE (Optimized, Poetry, Latest Drivers, Production Ready)
# ==============================================================================
FROM python:3.12-slim AS base

# Set timezone
ENV TZ=America/Santiago
ARG BUILD_DEPS="tzdata sudo git"

# Install only required build dependencies and latest MS SQL drivers
RUN apt-get update \
    && apt-get install -y ${BUILD_DEPS} \
    && pip install --upgrade pip \
    # Install poetry
    && pip install poetry \
    # Clean up build dependencies
    && apt-get purge -y --auto-remove gcc \
    && rm -rf /var/lib/apt/lists/* \
    && ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone


# Create app user
ARG USERNAME=appadmin
ARG USER_UID=1000
ARG USER_GID=$USER_UID
RUN groupadd -g $USER_GID $USERNAME \
    && useradd -mr -u $USER_UID -g $USERNAME $USERNAME \
    && groupmod --gid $USER_GID $USERNAME \
    && usermod --uid $USER_UID --gid $USER_GID $USERNAME \
    && chown -R $USER_UID:$USER_GID /home/$USERNAME \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# ==============================================================================
# DEVELOPMENT IMAGE
# ==============================================================================
FROM base AS develop_image
ARG USERNAME=appadmin
USER ${USERNAME}
ENV POETRY_VIRTUALENVS_IN_PROJECT=true
ENV ENVIRONMENT=DEV
RUN mkdir -p /home/${USERNAME}/app \
    /home/${USERNAME}/.vscode-server/extensions \
    /home/${USERNAME}/.vscode-server-insiders/extensions \
    && chown -R ${USERNAME} \
    /home/${USERNAME}/app \
    /home/${USERNAME}/.vscode-server \
    /home/${USERNAME}/.vscode-server-insiders
WORKDIR /home/${USERNAME}/app/05_ops

# ==============================================================================
# PRODUCTION IMAGE
# ==============================================================================
FROM base AS deploy_image
ENV ENVIRONMENT=PROD
ARG USERNAME=appadmin
USER ${USERNAME}
ENV POETRY_VIRTUALENVS_IN_PROJECT=true
RUN mkdir -p /home/${USERNAME}/app
COPY ./src /home/${USERNAME}/app/src
COPY ./pyproject.toml /home/${USERNAME}/app/
WORKDIR /home/${USERNAME}/app/05_ops
RUN poetry config virtualenvs.in-project true \
    && poetry install --no-interaction --no-ansi --only main
ENV PATH="/home/appadmin/app/.venv/bin:${PATH}"
CMD ["uvicorn", "src.adaptadores.primarios.api.fastapi.app:app", "--host", "0.0.0.0", "--port", "8080"]
