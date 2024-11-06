FROM node:18.12.0
WORKDIR /app
ENV NODE_ENV production
COPY ./public ./public
COPY /.next/standalone ./
COPY /.next/static ./.next/static
COPY next.config.js ./

EXPOSE 3000
CMD ["node", "server.js"]