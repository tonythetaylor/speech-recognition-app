# Use the official Node.js image as the base image
FROM node:18.18-alpine

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the backend port
EXPOSE 5009

# Start the application
# Generate Prisma client and start the server
CMD ["sh", "-c", "npx prisma generate && npx prisma migrate deploy && npm run start"]