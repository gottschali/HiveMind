FROM node:18-alpine
WORKDIR /server
COPY . /server/
# COPY ./cra-hive/src/shared/ /cra-hive/src/shared
RUN cd backend && npm install && npm install typescript -g
RUN cd backend && tsc
CMD ["node", "--unhandled-rejections=strict", "./backend/dist/backend/src/app.js"]
EXPOSE 4000