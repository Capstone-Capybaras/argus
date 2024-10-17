FROM --platform=linux/amd64 node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM --platform=linux/amd64 node:18-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY --from=build /app/dist ./dist

EXPOSE 8080

CMD ["sh", "-c", "if [ \"$NODE_ENV\" = 'production' ]; then npm run start:prod; elif [ \"$NODE_ENV\" = 'staging' ]; then npm run start:staging; else npm run start:dev; fi"]