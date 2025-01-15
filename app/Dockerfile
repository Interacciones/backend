# Codigo basado en:
# https://github.com/iic2173/ayudantia-docker/tree/main
# https://stackoverflow.com/questions/67765749/how-to-run-sequelize-migrations-inside-docker
# https://stackoverflow.com/questions/55483781/how-to-create-postgres-database-and-run-migration-when-docker-compose-up
# https://stackoverflow.com/questions/38882654/docker-entrypoint-running-bash-script-gets-permission-denied

FROM node:16-alpine
WORKDIR /koa-app
COPY package*.json ./
COPY . .
RUN npm install
RUN npm install -g sequelize-cli
CMD sh -c "sequelize db:migrate && node src/app.js"
EXPOSE 3000
