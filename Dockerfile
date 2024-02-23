FROM nginx:stable AS base
WORKDIR /app
EXPOSE 80

FROM node:lts AS build
WORKDIR /src

COPY [".", "."]
RUN npm install

FROM build AS publish
RUN npm run build

FROM base AS final
WORKDIR /app
COPY --from=publish /src/dist .
COPY ["nginx.conf", "/etc/nginx/nginx.conf"]
ENTRYPOINT ["nginx","-g","daemon off;"]