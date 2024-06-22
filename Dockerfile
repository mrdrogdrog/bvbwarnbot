FROM node:lts-slim AS base
USER node
WORKDIR /usr/src/app
COPY --chown=node package.json package.json
COPY --chown=node package-lock.json package-lock.json

FROM base AS builder
RUN npm install
COPY --chown=node . .
RUN npm run build

FROM base AS runner
RUN npm ci --omit=dev
COPY --from=builder --chown=node /usr/src/app/dist dist
COPY --chown=node templates/ templates
CMD ["node", "dist/index.mjs"]
