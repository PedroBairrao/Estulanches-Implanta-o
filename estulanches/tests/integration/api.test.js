const request = require('supertest');
const fs = require('fs');
const path = require('path');
const { newDb } = require('pg-mem');
const { createApp } = require('../../src/app');

let app;
beforeAll(async () => {
  const db = newDb();
  const { Pool } = db.adapters.createPg();
  const pool = new Pool();
  await pool.query(fs.readFileSync(path.join(__dirname, '../../src/schema.sql'), 'utf8'));
  app = createApp(pool);
});

test('GET /health responde ok', async () => {
  const r = await request(app).get('/health');
  expect(r.status).toBe(200);
  expect(r.body.db).toBe('up');
});

test('fluxo completo: cria produto, pedido e atualiza status', async () => {
  const p = await request(app).post('/api/produtos').send({ nome: 'Coxinha', preco: 6 });
  expect(p.status).toBe(201);
  const ped = await request(app).post('/api/pedidos')
    .send({ aluno: 'Ana', itens: [{ produto_id: p.body.id, quantidade: 3 }] });
  expect(ped.status).toBe(201);
  expect(ped.body.total).toBe(18);
  const up = await request(app).patch(`/api/pedidos/${ped.body.id}/status`).send({ status: 'PRONTO' });
  expect(up.body.status).toBe('PRONTO');
  const lista = await request(app).get('/api/pedidos');
  expect(lista.body.length).toBe(1);
});

test('rejeita entrada inválida e produto inexistente', async () => {
  expect((await request(app).post('/api/produtos').send({ nome: '', preco: -1 })).status).toBe(400);
  expect((await request(app).post('/api/pedidos')
    .send({ aluno: 'Ana', itens: [{ produto_id: 999, quantidade: 1 }] })).status).toBe(422);
  expect((await request(app).patch('/api/pedidos/1/status').send({ status: 'XYZ' })).status).toBe(400);
});

test('SQL injection não afeta o banco', async () => {
  const r = await request(app).post('/api/produtos').send({ nome: "x'); DROP TABLE produtos;--", preco: 1 });
  expect(r.status).toBe(201);
  expect((await request(app).get('/api/produtos')).status).toBe(200);
});
