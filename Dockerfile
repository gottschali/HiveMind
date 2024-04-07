FROM node:18-alpine

ENV PORT=4001

WORKDIR /code

# Try to combine both

COPY . /code/
RUN npm install
RUN npm run build
CMD ["npm", "run", "server"]
EXPOSE ${PORT}
