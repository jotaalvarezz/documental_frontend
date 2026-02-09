#
# Dockerfile multi-stage:
# - dev:     Vite dev server (hot-reload, sin "npm run build")
# - build:   Compila a /dist
# - prod:    Nginx sirviendo /dist
#

FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Development stage (Vite)
FROM deps AS dev
WORKDIR /app
COPY . .
EXPOSE 5173
ENV CHOKIDAR_USEPOLLING=true
CMD ["npm","run","dev","--","--host","0.0.0.0","--port","5173"]

# Build stage (Vite build)
FROM deps AS build
WORKDIR /app
COPY . .
RUN npm run build

# Production stage (static + reverse proxy /api -> backend)
FROM nginx:alpine AS prod
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
