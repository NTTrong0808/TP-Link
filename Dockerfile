FROM node:22-alpine

WORKDIR /usr/src/app
COPY /packages/backend/package*.json ./
RUN npm install
COPY /packages/backend .
COPY sst-env.d.ts ./
RUN npm run build

EXPOSE 8000
CMD ["node", "dist/main"]
