FROM node:12-alpine

WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .

RUN yarn install --production

COPY . .

CMD ["yarn", "start"]