FROM node:16
WORKDIR /docker_images/templates/express
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8081

CMD [ "npm", "start" ]
