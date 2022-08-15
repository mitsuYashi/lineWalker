FROM node:18
WORKDIR /usr/src/app
COPY package*/json ./
RUN yarn install

COPY . ./

CMD ["sh -c 'yarn && node server.js'"]