FROM node:20
WORKDIR /usr/src/app

RUN apt update \
    && apt install -y git build-essential python3 \
    && apt install -y fonts-noto-cjk

RUN npm install -g pnpm
COPY package*.json ./
RUN pnpm install

COPY . .

CMD ["pnpm", "start"]