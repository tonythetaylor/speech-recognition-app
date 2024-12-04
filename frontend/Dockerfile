# Stage 1: Build the React application
FROM node:18 as build

# Create and set the working directory
RUN mkdir -p /app && echo "Created /app directory"
WORKDIR /app
RUN pwd && ls -la && echo "WORKDIR is set to /app" # Debugging step to confirm WORKDIR

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN echo "After copying package.json:" && ls -la && npm ci

# Copy the source code into the container
COPY . .
RUN echo "After copying source code:" && ls -la

# Build the React application
RUN npm run build && ls build && echo "Build complete, contents of /app/build:" && ls -la build

# Stage 2: Serve with NGINX
FROM nginx:alpine

# Copy the build files to NGINX's default directory
COPY --from=build /app/build /usr/share/nginx/html
RUN echo "Copied build files to /usr/share/nginx/html" && ls -la /usr/share/nginx/html

# Optional: Copy custom NGINX configuration
COPY nginx.conf /etc/nginx/nginx.conf
RUN echo "Contents of /etc/nginx:" && ls -la /etc/nginx

# Expose NGINX port
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
