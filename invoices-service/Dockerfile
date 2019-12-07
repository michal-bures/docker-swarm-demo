# Stage 1 - build
FROM node:lts-alpine as builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . ./
RUN npm run build

EXPOSE 3001

ENTRYPOINT ["npm", "run", "start"]
