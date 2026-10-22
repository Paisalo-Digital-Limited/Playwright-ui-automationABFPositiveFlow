FROM mcr.microsoft.com/playwright:v1.53.2-jammy

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx playwright install
RUN npx playwright install-deps

# REMOVE CMD - Let Jenkins specify test command
