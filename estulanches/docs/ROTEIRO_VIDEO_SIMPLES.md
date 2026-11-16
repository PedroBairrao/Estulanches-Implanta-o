# Roteiro simplificado (≈ 3 min — mínimo exigido: 2 min)

**0:00–0:20 | Você + tela inicial do projeto**
"Olá, sou Pedro Bairrão. Este é o EstuLanches, um sistema de gestão de cardápio e pedidos para a cantina escolar. Ele substitui as anotações em papel e reduz filas e erros nos pedidos."

**0:20–0:45 | Arquivo `Dockerfile`**
"O Dockerfile define como a aplicação é empacotada em um container, garantindo que ela rode da mesma forma em qualquer ambiente. A imagem é enxuta e executa com um usuário sem privilégios de administrador, por segurança."

**0:45–1:10 | Arquivo `docker-compose.yml`**
"O docker-compose sobe a aplicação e o banco de dados PostgreSQL juntos. A aplicação só inicia quando o banco está pronto, e o banco não é exposto externamente: apenas a aplicação se comunica com ele."

**1:10–1:30 | Terminal: `docker compose ps` e `docker compose logs`**
"O `ps` mostra os dois serviços ativos e saudáveis, com a porta 3000 em uso. Nos logs, não há erros críticos."

**1:30–1:50 | Terminal: `npm test`**
"Foram criados 11 testes automatizados. Os unitários validam as regras de negócio, como o cálculo do total. Os de integração testam o fluxo completo: cadastrar produto, criar pedido e atualizar o status. Todos passaram."

**1:50–2:10 | Navegador em localhost:3000**
"Aqui está o sistema em funcionamento: consulto o cardápio, registro um pedido e ele aparece na lista de pedidos." *(Faça ao vivo.)*

**2:10–2:20 | PDF da RDM**
"Esta é a Ficha de Registro de Mudança, com versão implantada, data, resultado dos testes e status final."

**2:20–2:35 | Código do `app.js` na tela**
"Sobre segurança: as credenciais ficam fora do código, o banco é isolado, as entradas são validadas, as consultas são parametrizadas contra SQL injection e há limite de requisições por minuto."

**2:35–3:00 | Olhando para a câmera (escalabilidade)**
"Para atender o Brasil todo, com 1 milhão de usuários e 100 mil simultâneos, a aplicação seria replicada em várias instâncias atrás de um balanceador de carga, com escalonamento automático. O cardápio, muito consultado, ficaria em cache. O banco teria réplicas de leitura, e os pedidos passariam por uma fila para absorver picos. Com isso, a falha de uma instância não derruba o sistema. Obrigado."

---
**Dica:** se passar de 5 minutos, reduza a parte de segurança a uma frase.
