FROM node:18-alpine

ENV PORT=3000
ENV NODE_OPTIONS=--openssl-legacy-provider

WORKDIR /code

COPY . /code/
RUN npm install
RUN npm run build
CMD [ "./node_modules/.bin/serve", "-s", "build"]
EXPOSE 3000
