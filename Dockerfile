## INSTALL DEPENDENCIES ##
FROM node:16-alpine AS deps
WORKDIR /bgg-library
COPY package.json package-lock.json ./
RUN npm install ci --production

## REBUILD SOURCE CODE ##
FROM node:16-alpine AS builder
WORKDIR /bgg-library
COPY --from=deps /bgg-library/node_modules ./node_modules
COPY . .
# disable telemtry
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

## PRODUCTION IMAGE ##
FROM node:16-alpine AS runner
WORKDIR /bgg-library
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs


COPY --from=builder /bgg-library/next.config.js ./
COPY --from=builder /bgg-library/public ./public
COPY --from=builder /bgg-library/package.json ./package.json

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /bgg-library/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /bgg-library/.next/static ./.next/static


USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]