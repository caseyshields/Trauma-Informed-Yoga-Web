FROM node:20

WORKDIR /app

COPY package*.json /app
RUN npm i

COPY . /app

CMD ["node", "webserver.js"]