FROM node:18-alpine

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Expose the port the gateway runs on
EXPOSE 8000

# Start the gateway
CMD ["node", "gateway.js"]