# Stage 1: Build the application
FROM node:18-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Run the production server
FROM node:18-slim AS runner
WORKDIR /app
# You might need to copy specific build outputs, adjust as needed
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
RUN npm install --production --force # Install only production dependencies

ENV NODE_ENV production
CMD ["npm", "start"]