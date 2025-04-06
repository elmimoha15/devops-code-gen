def generate_dockerfile_content(values: dict) -> str:
    framework = values.get("framework")
    baseImage = values.get("baseImage")
    version = values.get("version")
    port = values.get("port")

    if not all([framework, baseImage, version, port]):
        raise ValueError("Missing required parameters for Dockerfile generation.")

    if framework == "flask":
        return f"""FROM {baseImage}:{version}

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE {port}

CMD ["flask", "run", "--host=0.0.0.0", "--port={port}"]"""

    elif framework == "django":
        return f"""FROM {baseImage}:{version}

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE {port}

CMD ["python", "manage.py", "runserver", "0.0.0.0:{port}"]"""

    elif framework == "vite":
        return f"""FROM {baseImage}:{version} as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE {port}

CMD ["nginx", "-g", "daemon off;"]"""

    elif framework == "nextjs":
        return f"""FROM {baseImage}:{version} AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE {port}

ENV PORT {port}

CMD ["node", "server.js"]"""

    else:
        raise ValueError(f"Unsupported framework: {framework}")