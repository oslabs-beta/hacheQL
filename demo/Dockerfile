FROM node:16.14.2
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
RUN ["./node_modules/.bin/webpack", "--config", "./webpack.config.js"]
EXPOSE 3000
ENTRYPOINT [ "node", "--experimental-specifier-resolution=node", "./server/server.js" ]
