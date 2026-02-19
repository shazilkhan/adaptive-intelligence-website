# Strapi 5 – production image for AWS (App Runner / ECS)
FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json yarn.lock* package-lock.json* ./
RUN yarn install --frozen-lockfile

# Copy source and build
COPY . .
ENV NODE_ENV=production
RUN yarn build

# Ensure uploads dir exists (local provider fallback)
RUN mkdir -p public/uploads

EXPOSE 1337
CMD ["yarn", "start"]
