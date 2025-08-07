FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm install webpack webpack-cli --save-dev
RUN npm run build
RUN npm install -g server
EXPOSE 3005
CMD ["npx", "serve", "-s", "dist", "-l", "3000"]
