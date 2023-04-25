FROM node:14-alpine

WORKDIR /usr/app
COPY package*.json ./
COPY index.js ./
RUN npm i

# Starting the Server and exposing port 4000
CMD npm start
EXPOSE 4000