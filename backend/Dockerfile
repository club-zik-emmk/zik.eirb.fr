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
EXPOSE 5000
# Run npm run start
CMD ["npm", "run", "start"]

