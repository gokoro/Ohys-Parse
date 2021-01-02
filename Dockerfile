FROM node:12-alpine

RUN mkdir app
WORKDIR /app
COPY . .

RUN yarn install --production

CMD ["yarn", "start"]