# Use the official Node.js image as the base image
FROM node:21.7.3-alpine 
# If you're using M1, M2 Mac, try this: 
# FROM  --platform=linux/amd64 node:16.14.0-alpine

# Set the working directory
WORKDIR /var/www/lottery

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application files
COPY . .

# Expose the port
EXPOSE 3000

# Start the application
CMD [ "node", "server.js" ]