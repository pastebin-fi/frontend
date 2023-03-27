# builder
FROM node:16 as build

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm prune --production

COPY src ./

RUN mkdir data

# final image
FROM gcr.io/distroless/nodejs:19

WORKDIR /app

COPY --from=build /app ./

CMD ["."]