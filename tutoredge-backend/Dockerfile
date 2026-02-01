FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies (including devDependencies)
RUN npm install

# Copy rest of the code
COPY . .

# Compile TypeScript
RUN npx tsc

# Expose port
EXPOSE 3000

# Run compiled server (production)
CMD ["node", "dist/server.js"]
