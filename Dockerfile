# syntax=docker/dockerfile:1

# ---- Stage 1: build the localized zui ----
FROM node:20-alpine AS builder
WORKDIR /app

# install dependencies (leverage layer cache)
COPY package.json package-lock.json ./
RUN npm ci

# build
COPY . .
RUN npm run build

# ---- Stage 2: serve with nginx + reverse proxy to zot ----
FROM nginx:1.27-alpine
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
