FROM node:18.14.2-alpine3.16  AS workspace-base

RUN apk add --no-cache bash curl jq

RUN export COREPACK_INTEGRITY_KEYS="$(curl https://registry.npmjs.org/-/npm/v1/keys | jq -c '{npm: .keys}')"

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

ENV CI=true
ENV HUSKY=0

WORKDIR /app

COPY frontend/package.json ./frontend/
COPY api/package.json ./api/

COPY packages/authentication/package.json ./packages/authentication/
COPY packages/helpers/package.json ./packages/helpers/
COPY packages/validation/package.json ./packages/validation/
COPY vendor/ ./vendor/

COPY pnpm-lock.yaml ./
RUN pnpm fetch
COPY . ./
RUN pnpm install --frozen-lockfile

ENV TZ=Europe/Berlin
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
ARG commitHash
ENV COMMIT_HASH=$commitHash
ARG version
ENV VERSION=$version

FROM api-build-stage AS api-production-stage

CMD [ "pnpm", "start", "-w", "./api"]

FROM workspace-base AS frontend-build-stage

ENV VITE_APP_COMMIT_HASH=$commitHash
ENV VITE_APP_VERSION=$version
RUN npm run build --workspace ./frontend

FROM workspace-base AS api-build-stage

# todo packing
# RUN npm run build --workspace ./api

COPY --from=frontend-build-stage /app/frontend/dist ./api/static/
ENV NODE_ENV=production
CMD [ "npm", "start", "-w", "./api" ]
