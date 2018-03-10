FROM node:latest
RUN npm install nodemon -g
# ADD . /usr/webdemo # content may not be static because of nodemon
WORKDIR /src/racetrack

