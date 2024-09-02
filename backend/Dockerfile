# Use the official Node.js image as a base image
FROM node:20-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the port that the NestJS app will run on
EXPOSE 3000

# Start the NestJS application in production mode
CMD ["npm", "run", "start:prod"]
