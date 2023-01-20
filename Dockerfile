FROM node:alpine as compiler

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY ./src /app/src
COPY tsconfig.json .

RUN yarn build

FROM node:alpine
WORKDIR /app

COPY package.json .
COPY yarn.lock .
COPY .env .
RUN yarn install --production
COPY --from=compiler /app/build /app/build

CMD ["yarn", "start:prod"]