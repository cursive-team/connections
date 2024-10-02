FROM node:22-alpine
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Copy shared packages
WORKDIR /usr/src
COPY local-shared/types ./local-shared/types

# Install shared package dependencies
WORKDIR /usr/src/local-shared/types
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