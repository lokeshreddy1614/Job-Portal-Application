# Use Node.js image as a base
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the entire project
COPY . .

# Build the frontend (Next.js)
RUN npm run build

# Expose the port Next.js runs on
EXPOSE 3000

# Start the frontend
CMD ["npm", "start"]

