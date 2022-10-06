FROM node:16-alpine AS build
# Run npm run build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build


FROM node:16-alpine AS runner
# Copy content from dist/
WORKDIR /app
COPY --from=build /app/dist /app/dist
COPY --from=build /app/.env /app/.env
COPY package.json package-lock.json /app/
RUN npm install --production
EXPOSE 5000
# Run npm run start
CMD ["npm", "run", "start"]

