FROM node:18-alpine

ENV PORT=4000

WORKDIR /code

# Try to combine both
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build
CMD ["npm", "run", "server"]
EXPOSE ${PORT}
