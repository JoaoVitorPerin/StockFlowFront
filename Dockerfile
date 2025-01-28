### STAGE 1: Build ###
FROM node:20.11-alpine AS build
WORKDIR /usr/src/app

# Copiar os arquivos necessários para a instalação
COPY package.json package-lock.json ./

# Instalar as dependências do Angular
RUN npm install -g npm@10.4.0
RUN npm install -g @angular/cli@17.1.0
RUN npm install

# Copiar o restante do código do projeto
COPY . .

# Gerar o build de produção
ARG env=prod
RUN ng build --configuration=production

### STAGE 2: Run ###
FROM nginx:stable

# Copiar o build final do Angular para o NGINX
COPY --from=build /usr/src/app/dist/stock-flow-angular /usr/share/nginx/html

# Configurações do NGINX
COPY nginx.conf /etc/nginx/
COPY default.conf /etc/nginx/conf.d/

# Expor a porta do NGINX
EXPOSE 80

# Iniciar o servidor
CMD ["nginx", "-g", "daemon off;"]
