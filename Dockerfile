FROM node:14-buster

WORKDIR /usr/src/app

COPY package.json ./

RUN npm install

COPY . .

# CMD [ "npm", "run", "start:prod" ]
CMD [ "npm", "run", "start:dev" ]