FROM node:22-slim
WORKDIR /app

RUN npm install -g npm@8.12.1

COPY ./package*.json ./
RUN npm install

COPY . .
#RUN npm run build

EXPOSE 8080
EXPOSE 8081

CMD [ "npm", "run", "dev" ]