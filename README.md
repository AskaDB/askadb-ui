askadb - UI

UI em React + Vite para executar consultas, visualizar resultados e gerenciar histórico.

Pré-requisitos
- Node 18+ e npm (ou yarn/pnpm)

Instalação e execução
```bash
npm install
npm run dev
```

Build de produção
```bash
npm run build
npm run preview
```

Docker
```bash
make docker-build
make docker-run   # abre em http://localhost:5173
```

Estrutura
- `src/components` – componentes de UI
- `src/features` – lógica de features (dashboard, history, query)
- `src/routes` – roteamento

Variáveis de ambiente
- Configure `.env` se necessário (por exemplo, URLs da API)
