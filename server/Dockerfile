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
RUN npm install
#^ this makes a lot of layers that should be one image not 11


# add app
COPY src ./src

#serve ../client/build

# run pre-build, build and start
CMD npm start

# 