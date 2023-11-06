FROM postgres:15

COPY ./src/database/create_database.sql /docker-entrypoint-initdb.d/

FROM node:18.17.1
WORKDIR /app
COPY package*.json ./
RUN yarn
COPY . .
RUN yarn db-generate 
# RUN yarn db-push
EXPOSE 8000
CMD ["yarn", "dev"]