# EstuLanches
API + front simples para cardápio e pedidos da cantina. Node 22 / Express / PostgreSQL 16 / Docker.

## Subir em produção
```bash
cp .env.example .env      # troque DB_PASSWORD
docker compose up -d --build
docker compose ps         # app e db "healthy"
docker compose logs       # auditar erros
```
Acesse http://localhost:3000 — saúde: `/health`.

## Testes
```bash
npm install && npm test   # unitários + integração (pg-mem)
```

## API
`GET/POST /api/produtos` · `GET/POST /api/pedidos` · `PATCH /api/pedidos/:id/status` · `GET /health`
