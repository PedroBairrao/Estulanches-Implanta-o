# Roteiro do vídeo (alvo ≈ 4:30 — mín. 2 / máx. 5 min)

| Tempo | Tela | Fala |
|---|---|---|
| 0:00–0:25 | Rosto/tela inicial + README | "Olá, sou Pedro Bairrão. Este é o EstuLanches: um sistema para a cantina escolar. Resolve filas e erros de anotação em papel: o aluno vê o cardápio, faz o pedido e a cantina acompanha o status." |
| 0:25–1:10 | `Dockerfile` | "Build multi-stage: um estágio instala dependências, a imagem final só leva o necessário, em node alpine (leve). Roda como usuário não-root e tem HEALTHCHECK." |
| 1:10–1:50 | `docker-compose.yml` | "Dois serviços: app e PostgreSQL. A app só sobe quando o banco está healthy. O banco não publica porta: fica na rede interna. Segredos vêm do .env e o volume pgdata guarda os dados." |
| 1:50–2:25 | Terminal: `docker compose up -d --build`, `ps`, `logs` | "Subi o ambiente, `ps` mostra os dois serviços healthy e a porta 3000. Nos logs não há erros críticos: só a conexão ao banco e a app iniciada." |
| 2:25–3:00 | Terminal: `npm test` + `tests/` | "11 testes com Jest. Unitários validam regras e cálculo do total em centavos. Integração sobe a API com banco em memória e testa o fluxo produto → pedido → status, entradas inválidas e SQL injection." |
| 3:00–3:30 | `src/app.js` e `validators.js` | "Express com rotas REST. Consultas parametrizadas, validação de entrada e o preço é lido do banco, nunca confiado ao cliente." |
| 3:30–3:50 | Navegador em localhost:3000 | Demonstre: ver cardápio, criar pedido, ver na lista; mostre `/health`. |
| 3:50–4:00 | `docs/Ficha_RDM_EstuLanches.pdf` | "Esta é a RDM: versão 1.0.0, data/hora, parâmetros alterados, resultado dos testes e status final: sucesso." |
| 4:00–4:15 | Código | "Segurança: helmet, rate limit, limite de payload, queries parametrizadas, container não-root, banco isolado, senha fora do código. Próximo passo: autenticação JWT e HTTPS." |
| 4:15–4:50 | (slide/fala) | **Escalabilidade (1 mi usuários, 100 mil simultâneos):** "A app é stateless, então escala horizontalmente: várias réplicas atrás de um balanceador, em Kubernetes com autoscaling. CDN para o front estático. Banco: PostgreSQL gerenciado com réplicas de leitura, pool de conexões (PgBouncer) e índices; cache Redis para o cardápio, que é muito lido. Fila (RabbitMQ/Kafka) para absorver picos de pedidos. Multi-região/zonas para alta disponibilidade, monitoramento com Prometheus/Grafana e rate limit no gateway." |
| 4:50–5:00 | Rosto | "Obrigado!" |

**Antes de gravar:** preencha data/hora e marque os checks da RDM (`ps`, `logs`, status final) após o deploy real, e reexporte o PDF.
