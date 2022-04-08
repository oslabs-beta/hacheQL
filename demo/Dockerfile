FROM node:16.14.2
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm install
RUN npm run build
EXPOSE 3000
ENTRYPOINT [ "node", "--experimental-specifier-resolution=node", "./server/server.js" ]
