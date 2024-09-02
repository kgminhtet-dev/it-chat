FROM ubuntu:latest
LABEL authors="kaung min htet"

ENTRYPOINT ["top", "-b"]

# Use the official Node.js image as a base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN bun install

# Copy the rest of the application code to the working directory
COPY . .

# Build the NestJS application
RUN bun run build

# Expose the port the app runs on
EXPOSE 3000

# Define the command to run the application
CMD ["bun", "run", "start:prod"]
