FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json turbo.json ./
COPY packages ./
COPY tests ./
COPY apps ./

RUN npm install

RUN cd packages/db && npx prisma generate && cd ../..

RUN npm run db:generate

CMD [ "npm","run","start:api-server" ]