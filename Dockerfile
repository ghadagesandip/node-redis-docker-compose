FROM node:alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/app

COPY . .

RUN npm install 

EXPOSE 8081

CMD ["npm", "start"]