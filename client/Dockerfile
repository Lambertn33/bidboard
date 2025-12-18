FROM node:22-alpine

WORKDIR /app

# Install dependencies first
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Ensure esbuild binaries are correct for Alpine Linux
RUN npm rebuild esbuild 2>/dev/null || npm install esbuild --force || true

CMD ["npm", "run", "dev"]