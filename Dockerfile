FROM node:12-alpine

WORKDIR /usr/src/app
COPY . .

RUN yarn install --production

CMD ["yarn", "start"]