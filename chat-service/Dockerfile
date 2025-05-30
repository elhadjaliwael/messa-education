# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install project dependencies
# If you use yarn, replace 'npm install' with 'yarn install'
RUN npm install

# Bundle app source
COPY . .

# Your application's default port is likely 3003 as per docker-compose
# EXPOSE <your_app_port_if_different_from_environment_variable>

# Define the command to run the application (assuming server.js is the entry point)
CMD [ "node", "server.js" ]