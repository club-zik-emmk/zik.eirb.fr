# This Dockerfile builds a ViteJS Vue3 project

# Build the project
FROM node:16-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm build

# Serve the project using Apache
FROM httpd:2.4-alpine
COPY --from=build /app/dist /usr/local/apache2/htdocs/

# Copy Apache configuration
COPY my-httpd.conf /usr/local/apache2/conf/httpd.conf

RUN chown -R www-data:www-data /usr/local/apache2/htdocs/
EXPOSE 80