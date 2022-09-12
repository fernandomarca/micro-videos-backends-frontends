FROM node:16-slim

# USER node

WORKDIR /home/node/app

#RUN usermod -u 1000 node
# RUN chown 1000:1000 -R /home/node/app

CMD [ "sh","-c","npm install && tail -f /dev/null" ]