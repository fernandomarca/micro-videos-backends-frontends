FROM node:16-slim

# USER node
# npm view @types/node

WORKDIR /home/node/app

CMD [ "sh","-c","npm install && tail -f /dev/null" ]