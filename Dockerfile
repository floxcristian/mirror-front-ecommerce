FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build:ssr
EXPOSE 4000
CMD ["node", "./dist/front-ecommerce/server/main.js"]