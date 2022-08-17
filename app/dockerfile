FROM node:18
WORKDIR /usr/src/app
COPY package*.json yarn.lock ./
# RUN yarn install --prod
RUN yarn install --frozen-lockfile

COPY . ./

CMD [ "node", "server.js" ]
# CMD ["yarn", "start"]
# CMD ["sh", "-c", "echo", "hello"]
