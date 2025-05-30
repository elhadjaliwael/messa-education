FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Expose the port the service runs on
EXPOSE 3001

# Start the service
CMD ["node", "server.js"]