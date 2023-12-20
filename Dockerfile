# Use the official Node.js 14 image as the base image
FROM node:14 as builder

# Set the working directory in the Docker container
WORKDIR /usr/src/app

# Copy the current directory contents into the Docker container
COPY . .

# Install any needed packages specified in package.json
RUN npm install

# Build the project
RUN npm run build

# Stage 2: Serve the app with NGINX
FROM nginx:alpine

# Copy the build output to replace the default NGINX content.
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Expose port for the app
EXPOSE 3001

# Start Nginx and keep it running
CMD ["nginx", "-g", "daemon off;"]