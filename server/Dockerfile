FROM node:20 as build
WORKDIR /usr/src/app

COPY package.json .
COPY yarn.lock .
COPY tsconfig.json ./
COPY data ./data

RUN yarn install

COPY . .
RUN yarn build

FROM node:20-slim
RUN apt update && apt install libssl-dev dumb-init -y --no-install-recommends

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node --from=build /usr/src/app/data ./data
COPY --chown=node:node --from=build /usr/src/app/.env .env
COPY --chown=node:node --from=build /usr/src/app/package.json .
COPY --chown=node:node --from=build /usr/src/app/yarn.lock .
COPY --chown=node:node --from=build /usr/src/app/tsconfig.json ./tsconfig.json


RUN yarn install --production

EXPOSE 8000
CMD ["dumb-init", "node", "dist/server.js"]
