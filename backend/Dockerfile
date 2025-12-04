# backend/Dockerfile

# Use a small Node image
FROM node:20-alpine

# Create app directory inside the container
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy source code and database folder
COPY src ./src
COPY data ./data

# Environment
ENV NODE_ENV=production
ENV PORT=4000

# Expose backend port
EXPOSE 4000

# Start the application
CMD ["node", "src/index.js"]
