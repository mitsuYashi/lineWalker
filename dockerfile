FROM node:18
WORKDIR /usr/src/app
RUN yarn install
CMD ["sh -c 'yarn && node server.js'"]