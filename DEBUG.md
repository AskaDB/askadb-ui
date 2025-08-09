# Debug da UI - AskADB

## Opções de Debug

### 1. Debug Local (Recomendado)

Para fazer debug local da UI:

1. **Pare os containers atuais:**
   ```bash
   cd askadb-infra
   make down
   ```

2. **Suba apenas a UI em modo desenvolvimento:**
   ```bash
   make dev-ui
   ```

3. **Acesse a aplicação:**
   - Abra http://localhost:5173 no navegador
   - A UI estará rodando com hot reload

4. **Configure o debug no VS Code:**
   - Abra o VS Code na pasta `askadb-ui`
   - Vá para a aba "Run and Debug" (Ctrl+Shift+D)
   - Selecione "askadb-ui: Chrome (http://localhost:5173)"
   - Clique em "Start Debugging" (F5)

5. **Defina breakpoints:**
   - Abra qualquer arquivo `.tsx` na pasta `src`
   - Clique na linha onde quer parar (breakpoint)
   - O debugger irá parar quando a linha for executada

### 2. Debug com Captura de Requisições

Para capturar requisições de rede:

1. **Use a configuração de debug com rede:**
   - Selecione "askadb-ui: Chrome with Network Debug"
   - Isso abrirá o Chrome com debug de rede habilitado

2. **Abra as DevTools:**
   - Pressione F12 ou Ctrl+Shift+I
   - Vá para a aba "Network"
   - Todas as requisições serão capturadas

3. **Debug de requisições:**
   - Clique em qualquer requisição para ver detalhes
   - Verifique Headers, Payload, Response
   - Use breakpoints no código para parar antes/depois das requisições

### 3. Debug no Container

Se preferir fazer debug no container:

1. **Suba a UI em modo desenvolvimento:**
   ```bash
   cd askadb-infra
   make dev-ui
   ```

2. **Configure o debug no VS Code:**
   - Abra o VS Code na pasta `askadb-ui`
   - Vá para a aba "Run and Debug" (Ctrl+Shift+D)
   - Selecione "askadb-ui: Chrome (http://localhost:5173) - Container"
   - Clique em "Start Debugging" (F5)

### 4. Debug com Attach

Para fazer debug com attach:

1. **Abra o Chrome com debug habilitado:**
   ```bash
   # No macOS
   /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222
   
   # No Linux
   google-chrome --remote-debugging-port=9222
   ```

2. **Configure o debug no VS Code:**
   - Selecione "askadb-ui: Attach to Chrome"
   - Clique em "Start Debugging" (F5)

## Debug de Outros Projetos

### Debug do Orchestrator API

1. **Abra o projeto no VS Code:**
   ```bash
   code askadb-orchestrator-api
   ```

2. **Configure o debug:**
   - Vá para "Run and Debug" (Ctrl+Shift+D)
   - Selecione "orchestrator-api: FastAPI (uvicorn)"
   - Clique em "Start Debugging" (F5)

3. **Defina breakpoints:**
   - Abra arquivos `.py` na pasta `app`
   - Clique na linha para definir breakpoints
   - Faça requisições para testar

### Debug do NL Query

1. **Abra o projeto no VS Code:**
   ```bash
   code askadb-nl-query
   ```

2. **Configure o debug:**
   - Vá para "Run and Debug" (Ctrl+Shift+D)
   - Selecione "nl-query: FastAPI (uvicorn)"
   - Clique em "Start Debugging" (F5)

3. **Defina breakpoints:**
   - Abra arquivos `.py` na pasta `app`
   - Clique na linha para definir breakpoints
   - Faça requisições para testar

### Debug do Query Engine

1. **Abra o projeto no VS Code:**
   ```bash
   code askadb-query-engine
   ```

2. **Configure o debug:**
   - Vá para "Run and Debug" (Ctrl+Shift+D)
   - Selecione "query-engine: Rust (Debug)"
   - Clique em "Start Debugging" (F5)

3. **Defina breakpoints:**
   - Abra arquivos `.rs` na pasta `src`
   - Clique na linha para definir breakpoints
   - Execute o código para testar

## Captura de Requisições

### Usando Chrome DevTools

1. **Abra as DevTools:**
   - Pressione F12 ou Ctrl+Shift+I
   - Vá para a aba "Network"

2. **Configure filtros:**
   - Use "Fetch/XHR" para ver apenas requisições AJAX
   - Use "All" para ver todas as requisições

3. **Analise requisições:**
   - Clique em qualquer requisição para ver detalhes
   - Verifique Headers, Payload, Response
   - Use "Preserve log" para manter histórico

### Usando VS Code

1. **Use a configuração de debug com rede:**
   - Selecione "askadb-ui: Chrome with Network Debug"
   - Isso abrirá o Chrome com debug de rede habilitado

2. **Configure breakpoints:**
   - Defina breakpoints no código que faz requisições
   - Use `console.log` para debugar dados

3. **Use o console:**
   - Abra o console do navegador (F12)
   - Use `console.log`, `console.error` para debug

## Estrutura do Projeto

```
askadb-ui/
├── src/
│   ├── components/          # Componentes React
│   ├── features/           # Features organizadas
│   ├── pages/              # Páginas da aplicação
│   └── routes/             # Configuração de rotas
├── .vscode/
│   ├── launch.json         # Configurações de debug
│   ├── settings.json       # Configurações do VS Code
│   ├── tasks.json          # Tarefas do VS Code
│   └── extensions.json     # Extensões recomendadas
└── vite.config.ts          # Configuração do Vite
```

## Troubleshooting

### Breakpoints não funcionam

1. **Verifique se está usando o modo desenvolvimento:**
   - Certifique-se de que está usando `make dev-ui` e não `make up`
   - A URL deve ser http://localhost:5173, não http://localhost:3000

2. **Verifique as configurações do VS Code:**
   - Certifique-se de que o `webRoot` está correto no `launch.json`
   - Verifique se o `sourceMaps` está habilitado

3. **Limpe o cache:**
   ```bash
   cd askadb-ui
   rm -rf node_modules/.vite
   npm run dev
   ```

### Hot reload não funciona

1. **Verifique se está usando volumes:**
   - O container deve ter volumes mapeados para o código fonte
   - Use `make dev-ui` para garantir que os volumes estão corretos

2. **Verifique as configurações do Vite:**
   - O `usePolling: true` deve estar habilitado no `vite.config.ts`

### Requisições não aparecem

1. **Verifique se o DevTools está aberto:**
   - Certifique-se de que a aba "Network" está ativa
   - Use "Preserve log" para manter histórico

2. **Verifique filtros:**
   - Use "Fetch/XHR" para ver apenas requisições AJAX
   - Use "All" para ver todas as requisições

3. **Verifique CORS:**
   - Certifique-se de que o backend está configurado para CORS
   - Verifique se as URLs estão corretas

## Comandos Úteis

```bash
# Subir UI em desenvolvimento
cd askadb-infra
make dev-ui

# Ver logs da UI
make logs-ui

# Parar todos os containers
make down

# Rebuild da UI
cd askadb-ui
docker build -f Dockerfile.dev -t askadb-ui-dev .

# Debug de outros serviços
cd askadb-orchestrator-api
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

cd askadb-nl-query
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8001

cd askadb-query-engine
cargo run
```
