FROM node:latest

EXPOSE 5173
WORKDIR /opt/frontend
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
ENTRYPOINT npm run dev