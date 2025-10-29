FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./

RUN npm ci 

COPY . .

ARG VITE_API_URL_BASE=/api/v2

ENV VITE_API_URL_BASE=$VITE_API_URL_BASE

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 81

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:81/health || exit 1

CMD ["nginx", "-g", "daemon off;"]