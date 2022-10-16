# pull official base image for NODE 18.xx
FROM node:18

# set working directory as QURA
WORKDIR /QURA/server

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH


# THIS NEEDS TO BE REMOVED it's only for build time
COPY tslint.json ./
COPY tsconfig.json ./


# install app dependencies
COPY package.json ./
COPY package-lock.json ./

# add app
COPY src ./src


RUN npm install
# pre-build, build 
#^ this makes a lot of layers and should be used as a source in multi-stage build

# start
CMD node .

