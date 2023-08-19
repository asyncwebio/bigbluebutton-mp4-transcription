FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

RUN mkdir -p /usr/src/app/presentation

CMD node /usr/src/app/app.js

