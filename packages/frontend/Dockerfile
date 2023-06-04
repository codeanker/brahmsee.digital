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

ARG commitHash
ENV VITE_APP_COMMIT_HASH $commitHash
ARG version
ENV VITE_APP_VERSION $version

FROM base as build-stage
ARG mode
RUN npm run build:$mode --workspace ./frontend

# production stage
FROM nginx:1.13.12-alpine as production-stage
COPY --from=build-stage /app/frontend/dist /usr/share/nginx/html
EXPOSE 80
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
