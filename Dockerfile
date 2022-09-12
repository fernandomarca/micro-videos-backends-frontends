FROM node:16-slim

WORKDIR /home/node/app

#RUN usermod -u 1000 node
#RUN chown node:node -R /home/node/app

# USER node

CMD [ "sh","-c","npm install && tail -f /dev/null" ]