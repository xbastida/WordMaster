# Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Expose ports for React (3000) and API server (3001)
EXPOSE 3000 3001

# Start both server and React app
CMD ["npm", "run", "dev"]


