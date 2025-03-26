# Projeto Angular 19.2.3 + Node.js 20.12.2

## 🛠️ Tecnologias Utilizadas
- **Frontend:** Angular 19.2.3, TypeScript
- **Backend:** Node.js 20.12.2, Express
- **Banco de Dados:** MySQL 8.1.31

## 📌 Requisitos
Certifique-se de ter instalado:
- [Node.js 20.12.2](https://nodejs.org/)
- [Angular CLI](https://angular.io/cli)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

## 🚀 Configuração do Ambiente
### Clonando o Repositório
```bash
git clone https://github.com/wesleypetitemberte/nodejs-poc.git
cd nodejs-poc
nvm use
```

### Instalando Dependências
Para o frontend:
```bash
cd frontend
npm install
```
Para o backend:
```bash
cd backend
npm install
```

## 🔧 Execução do Projeto
### Iniciando aplicação backend (Node.js)
```bash
cd backend
npm start
```
O backend estará disponível em: `http://localhost:3000`

### Iniciando aplicação frontend (Angular)
```bash
cd frontend
npm start
```
O frontend estará disponível em: `http://localhost:4200`

## 📁 Estrutura do Projeto
```
/seu-repositorio
├── frontend/     # Código Angular
│   ├── src/      # Código-fonte
│   ├── angular.json  # Configuração do Angular
│   ├── package.json  # Dependências do frontend
├── backend/      # Código Node.js
│   ├── src/      # Código-fonte
│   ├── package.json  # Dependências do backend
```