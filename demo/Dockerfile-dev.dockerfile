FROM node:16.14.2
RUN npm install -g webpack
WORKDIR /usr/src/app
COPY package*.json /usr/src/app
RUN npm install
EXPOSE 8080
