# syntax=docker/dockerfile:1.4

# 1. For build React app
FROM node:lts-alpine3.17 AS development

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

# Same as npm install
RUN npm ci
# RUN npm install --silent

# Add rest of the client code
COPY . /app

ENV CI=true
ENV PORT=3000

# EXPOSE 3000

CMD [ "npm", "start" ]

##-------------------
## add plugins here:
##-------------------
# RUN npm install axios
RUN npm install @mui/material @mui/icons-material
RUN npm install @emotion/react @emotion/styled
RUN npm install @mui/styled-engine
RUN npm install react-router-dom

FROM development AS build

RUN npm run build

# FROM development as dev-envs
# RUN <<EOF
# apt-get update
# apt-get install -y --no-install-recommends git
# EOF

# RUN <<EOF
# useradd -s /bin/bash -m vscode
# groupadd docker
# usermod -aG docker vscode
# EOF
# # install Docker tools (cli, buildx, compose)
# COPY --from=gloursdocker/docker / /
# CMD [ "npm", "start" ]

# 2. For Nginx setup
FROM nginx:alpine

# Copy config nginx
COPY --from=build /app/.nginx/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy static assets from builder stage
COPY --from=build /app/build .

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]

