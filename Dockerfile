FROM node:10-alpine

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

RUN mkdir -p /home/node/app/node_modules && \
    mkdir -p /home/node/app/build && \
    chown -R node:node /home/node/app

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

WORKDIR /home/node/app

USER node

COPY --chown=node:node . .

RUN npm install

CMD [ "node" ]