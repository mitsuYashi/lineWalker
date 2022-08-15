FROM node:18
WORKDIR /usr/src/app
COPY ./app/package.json ./
RUN yarn install

COPY ./app ./

CMD ["sh -c 'yarn && node server.js'"]