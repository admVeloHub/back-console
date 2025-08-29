# 📋 Instruções de Deploy - Console de Conteúdo

## 🎯 Objetivo
Configurar dois repositórios separados no GitHub e fazer deploy no Vercel:
- **Backend**: API Node.js com MongoDB
- **Frontend**: Site estático HTML/CSS/JS

## 📁 Estrutura dos Repositórios

### 1. Repositório Backend (`console-conteudo-backend`)
```
console-conteudo-backend/
├── server.js
├── package.json
├── vercel.json
├── env.example
├── public/
│   └── backend-status.html
└── README.md
```

### 2. Repositório Frontend (`console-conteudo-frontend`)
```
console-conteudo-frontend/
├── public/
│   ├── index.html
│   ├── artigos.html
│   ├── velonews.html
│   ├── bot-perguntas.html
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   └── app.js
│   ├── console.png
│   └── success.gif
├── package.json
├── vercel.json
└── README.md
```

## 🚀 Passo a Passo do Deploy

### Passo 1: Preparar Repositório Backend

1. **Criar novo repositório no GitHub:**
   - Nome: `console-conteudo-backend`
   - Descrição: Backend API para Console de Conteúdo
   - Público ou privado (sua escolha)

2. **Fazer upload dos arquivos do backend:**
   ```bash
   # Copiar apenas os arquivos do backend para o novo repositório
   git clone https://github.com/seu-usuario/console-conteudo-backend.git
   cd console-conteudo-backend
   
   # Copiar arquivos do backend atual
   cp ../server.js .
   cp ../package.json .
   cp ../vercel.json .
   cp ../env.example .
   cp -r ../public .
   cp ../README.md .
   
   # Commit e push
   git add .
   git commit -m "Initial backend setup"
   git push origin main
   ```

### Passo 2: Deploy do Backend no Vercel

1. **Conectar repositório ao Vercel:**
   - Acessar [vercel.com](https://vercel.com)
   - Clicar em "New Project"
   - Importar repositório `console-conteudo-backend`

2. **Configurar projeto:**
   - **Framework Preset**: Node.js
   - **Root Directory**: `./` (deixar vazio)
   - **Build Command**: (deixar vazio)
   - **Output Directory**: (deixar vazio)
   - **Install Command**: `npm install`

3. **Configurar variáveis de ambiente:**
   - `MONGODB_URI`: `mongodb+srv://lucasgravina:nKQu8bSN6iZl8FPo@clustercentral.quqgq6x.mongodb.net/velohub?retryWrites=true&w=majority&appName=ClusterCentral`
   - `DB_NAME`: `console_conteudo`
   - `NODE_ENV`: `production`
   - `FRONTEND_URL`: `https://front-console.vercel.app`

4. **Fazer deploy:**
   - Clicar em "Deploy"
   - Aguardar o deploy completar
   - Anotar a URL gerada (ex: `https://back-console.vercel.app`)

### Passo 3: Preparar Repositório Frontend

1. **Criar novo repositório no GitHub:**
   - Nome: `console-conteudo-frontend`
   - Descrição: Frontend para Console de Conteúdo
   - Público ou privado (sua escolha)

2. **Fazer upload dos arquivos do frontend:**
   ```bash
   # Copiar apenas os arquivos do frontend para o novo repositório
   git clone https://github.com/seu-usuario/console-conteudo-frontend.git
   cd console-conteudo-frontend
   
   # Copiar arquivos do frontend atual
   cp -r ../frontend/public .
   cp ../frontend/package.json .
   cp ../frontend/vercel.json .
   cp ../frontend/README.md .
   
   # Commit e push
   git add .
   git commit -m "Initial frontend setup"
   git push origin main
   ```

### Passo 4: Deploy do Frontend no Vercel

1. **Conectar repositório ao Vercel:**
   - Acessar [vercel.com](https://vercel.com)
   - Clicar em "New Project"
   - Importar repositório `console-conteudo-frontend`

2. **Configurar projeto:**
   - **Framework Preset**: Other
   - **Root Directory**: `./` (deixar vazio)
   - **Build Command**: (deixar vazio)
   - **Output Directory**: `public`
   - **Install Command**: (deixar vazio)

3. **Fazer deploy:**
   - Clicar em "Deploy"
   - Aguardar o deploy completar
   - Anotar a URL gerada (ex: `https://front-console.vercel.app`)

## 🔧 Verificações Pós-Deploy

### Testar Backend:
1. Acessar: `https://back-console.vercel.app`
   - Deve mostrar a página de status do backend
2. Testar API: `https://back-console.vercel.app/api/test`
   - Deve retornar JSON com status da API
3. Testar Health: `https://back-console.vercel.app/health`
   - Deve retornar status do servidor

### Testar Frontend:
1. Acessar: `https://front-console.vercel.app`
   - Deve mostrar o console principal
2. Testar formulários:
   - Clicar em "Artigos" e tentar enviar um formulário
   - Verificar se não há erros de conexão

### Testar Integração:
1. No frontend, tentar enviar um artigo
2. Verificar se aparece o feedback de sucesso
3. Verificar se os dados chegam no backend

## 🐛 Solução de Problemas Comuns

### Erro 404 no Frontend:
- Verificar se o `vercel.json` está configurado corretamente
- Confirmar se a pasta `public` está na raiz do repositório

### Erro de Conexão com API:
- Verificar se a URL da API está correta no `app.js`
- Confirmar se o backend está online
- Testar endpoints diretamente no navegador

### Backend não responde:
- Verificar variáveis de ambiente no Vercel
- Confirmar se o MongoDB está acessível
- Verificar logs no Vercel

### CORS Errors:
- Verificar se `FRONTEND_URL` está configurada corretamente
- Confirmar se o CORS está configurado no backend

## 📞 URLs Finais

Após o deploy bem-sucedido, você terá:

- **Backend API**: `https://back-console.vercel.app`
- **Frontend Console**: `https://front-console.vercel.app`
- **Backend Status**: `https://back-console.vercel.app` (página de status)
- **API Test**: `https://back-console.vercel.app/api/test`

## ✅ Checklist Final

- [ ] Backend deployado e funcionando
- [ ] Frontend deployado e funcionando
- [ ] API respondendo corretamente
- [ ] Formulários enviando dados
- [ ] Página de status do backend acessível
- [ ] URLs configuradas corretamente
- [ ] Variáveis de ambiente configuradas
- [ ] CORS funcionando
- [ ] MongoDB conectado

## 🔄 Atualizações Futuras

### Para atualizar o Backend:
1. Fazer commit no repositório `console-conteudo-backend`
2. O Vercel fará deploy automático
3. Testar: `https://back-console.vercel.app/api/test`

### Para atualizar o Frontend:
1. Fazer commit no repositório `console-conteudo-frontend`
2. O Vercel fará deploy automático
3. Testar formulários no console
