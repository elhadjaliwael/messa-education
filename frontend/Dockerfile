# Stage 1: Build the React application
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
# If you use yarn, replace 'npm install' with 'yarn install --frozen-lockfile'
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
# If you use yarn, replace 'npm run build' with 'yarn build'
RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:stable-alpine

# Copy the build output from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration if you have a custom one
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for Nginx

COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]