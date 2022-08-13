FROM node:lts-alpine

WORKDIR /var/remote-workout

COPY . .

CMD [ "npm", "run", "start"]
