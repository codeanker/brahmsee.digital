FROM node:18.15.0-alpine3.16 AS base
ENV CI=true
ENV HUSKY=0

WORKDIR /app

COPY frontend/package.json ./frontend/
COPY api/package.json ./api/
COPY packages/validation/package.json ./packages/validation/
# COPY packages/PACKAGE/package.json ./packages/PACKAGE/

COPY package*.json ./

RUN npm ci
COPY . ./

ENV TZ=Europe/Berlin
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
ARG commitHash
ENV COMMIT_HASH $commitHash
ARG version
ENV VERSION $version

FROM base as build-stage

RUN npm run build --workspace ./api

FROM build-stage as production-stage

CMD [ "npm", "start", "-w", "./api"]
