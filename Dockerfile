FROM node:20-alpine3.17 AS workspace-base
ENV CI=true
ENV HUSKY=0

WORKDIR /app

COPY frontend/package.json ./frontend/
COPY api/package.json ./api/

COPY packages/authentication/package.json ./packages/authentication/
COPY packages/helpers/package.json ./packages/helpers/
COPY packages/validation/package.json ./packages/validation/

COPY package*.json ./

RUN npm ci
COPY . ./
RUN npm run postinstall --workspace ./api

ENV TZ=Europe/Berlin
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
ARG commitHash
ENV COMMIT_HASH $commitHash
ARG version
ENV VERSION $version

FROM api-build-stage as api-production-stage

CMD [ "npm", "start", "-w", "./api"]

FROM workspace-base as frontend-build-stage
ARG tenant
ENV VITE_APP_COMMIT_HASH $commitHash
ENV VITE_APP_VERSION $version
RUN npm run build --workspace ./frontend

FROM workspace-base as api-build-stage

# todo packing
# RUN npm run build --workspace ./api

COPY --from=frontend-build-stage /app/frontend/dist ./api/static/
CMD [ "npm", "start", "-w", "./api" ]
