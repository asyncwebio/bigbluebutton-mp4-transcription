FROM manishkatyan/bbb-mp4

COPY package.json ./
#Install npm scripts
RUN npm install npm@latest -g
RUN npm install


#copy all files from bbb-mp4 project
COPY *.sh ./
COPY *.js ./
COPY .env ./
COPY logs ./logs

RUN mkdir -p processing processed

# Command that will execute when container starts
ENTRYPOINT ["sh","docker-entrypoint.sh"]
CMD node /usr/src/app/bbb-mp4.js
