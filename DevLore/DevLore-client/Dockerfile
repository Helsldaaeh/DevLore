FROM node:22-slim
WORKDIR /app

RUN npm install -g npm@8.12.1

COPY ./package*.json ./
RUN npm install

COPY . .
#RUN npm run build

EXPOSE 5173
CMD [ "npm", "run", "dev" ]