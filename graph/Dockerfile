FROM node:17.4-alpine

RUN mkdir -p /src/app
WORKDIR /src/app

COPY package*.json ./

RUN npm install -g npm@8.18.0
RUN npm install --silent

COPY . .

EXPOSE 5000

CMD ["npm","start"]