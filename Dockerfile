FROM node:10-alpine
RUN apk add git --no-cache
RUN mkdir -p /home/node/app/node_modules
COPY . /home/node/app/
RUN chown -R node:node /home/node/app
WORKDIR /home/node/app
USER node
RUN npm install
CMD ["npm", "run", "build"]
