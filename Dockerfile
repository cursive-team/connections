# https://stackoverflow.com/questions/65612411/forcing-docker-to-use-linux-amd64-platform-by-default-on-macos/69636473#69636473
FROM --platform=linux/amd64 node:22-alpine
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Copy shared packages
WORKDIR /usr/src
COPY packages/types ./packages/types

# Install shared package dependencies
WORKDIR /usr/src/packages/types
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

# Copy backend app
WORKDIR /usr/src/apps/backend
COPY apps/backend/package*.json ./
COPY apps/backend/tsconfig.json ./
COPY apps/backend/src ./src
COPY apps/backend/prisma ./prisma

# Install backend dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install

# Build it
RUN pnpm run build

# Run it
EXPOSE 8080
CMD ["pnpm", "run", "serve"]