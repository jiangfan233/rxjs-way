# FROM node:16-alpine AS base

# # 1. Install dependencies only when needed
# FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat

# WORKDIR /app
# COPY . /app 
# RUN npm install && npm run build
# RUN ls -al .

# FROM base AS builder

# WORKDIR /app

# ENV NODE_ENV=production

# RUN ls -al .

# # Automatically leverage output traces to reduce image size
# # https://nextjs.org/docs/advanced-features/output-file-tracing
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# EXPOSE 6666

# ENV PORT 6666
# ENV HOSTNAME localhost

# CMD ["node", "server.js"]



# FROM node:16-alpine AS base

# WORKDIR /base

# COPY . .

# FROM base AS runner
# WORKDIR /runner
# COPY --from=base /base/lib /runner/test/lib

# RUN ls -al . && ls -al ./test



# **********************************************

FROM node:16-alpine AS base
RUN apk add libc6-compat

FROM base AS deps

WORKDIR /deps

# Install dependencies based on the preferred package manager
COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* ./
# RUN \
#   if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
#   elif [ -f package-lock.json ]; then npm ci; \
#   elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
#   else echo "Lockfile not found." && exit 1; \
#   fi && ls -al .

RUN npm install
COPY . .

# 禁用nextjs 遥测
ENV NEXT_TELEMETRY_DISABLED 1
# ENV NODE_ENV production

RUN npm run build

ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# 
# COPY ./public ./.next/standalone/public 
# COPY ./.next/static ./.next/standalone/.next/static


# FROM base AS runner
# WORKDIR /runner
# 使用standalone打包有问题
# # # 把/deps/.next/standalone中的所有文件复制到 /runner中
# COPY --from=deps /deps/.next /runner/.next
# COPY --from=deps /deps/node_modules /runner/node_modules


# RUN ls -al .  &&  ls -al .next

EXPOSE 3000


ENV PORT 3000
# set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD ["npm", "start"]
