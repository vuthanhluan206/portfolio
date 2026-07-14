# ============================
# Build stage
# ============================
FROM node:20-alpine AS build
WORKDIR /app

# Cài dependencies trước (tận dụng cache khi package.json không đổi)
COPY package*.json ./
RUN npm ci

# Copy toàn bộ source code
COPY . .

# ---- Nhận biến môi trường lúc build ----
# Railway sẽ tự động truyền Service Variables cùng tên vào làm build ARG
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# ---- Cache buster ----
# Đổi giá trị này (v1 -> v2 -> v3...) mỗi khi muốn ép Docker build lại
# bước RUN npm run build từ đầu, không dùng lại cache cũ.
ARG CACHEBUST=v1

RUN npm run build

# ============================
# Run stage (serve bằng nginx)
# ============================
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
