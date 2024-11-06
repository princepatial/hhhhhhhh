FROM node:18.12.0
WORKDIR /app
COPY . .
ENTRYPOINT npm run start:prod && npm run migrate:up 
