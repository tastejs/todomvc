FROM node:20-alpine

RUN apk add --no-cache git

WORKDIR /mam

# Init MAM workspace: clone the root repo so mol/ and node/ are available
RUN git init && git remote add origin https://github.com/hyoo-ru/mam.git && git pull origin master

# Copy our todomvc app into the workspace
RUN mkdir -p /mam/todomvc
COPY todomvc/ /mam/todomvc/

RUN npm exec mam todomvc

EXPOSE 9080

# docker compose up --build
# http://localhost:9080/todomvc/-/test.html
