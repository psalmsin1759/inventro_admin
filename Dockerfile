# Use an official Node.js runtime as the base image
FROM node:14-alpine

# Set the working directory within the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the app's source code to the working directory
COPY . .

# Build the React app
RUN npm run build

# Expose port 3000 for the application
EXPOSE 80

# Command to start the application
CMD ["npm", "start"]
