# builder
FROM node:18 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm prune --production

COPY src ./

# final image
FROM gcr.io/distroless/nodejs:18

WORKDIR /app

COPY --from=build /app ./

CMD ["."]