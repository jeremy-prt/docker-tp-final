FROM node:20
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY index.js .
EXPOSE 5088
CMD ["node", "index.js"]