FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:22-bullseye

# pnpm
ENV PNPM_HOME=/workspaces/pnpm
ENV PATH="$PNPM_HOME:$PATH"
RUN su node -c "npm install -g pnpm@9.14.2"
RUN corepack enable

ENV TZ=Europe/Berlin
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
