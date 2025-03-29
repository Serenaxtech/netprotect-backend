FROM node:20.19-alpine

WORKDIR /usr/src/net-protect

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]