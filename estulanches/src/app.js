const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { STATUS, validarProduto, validarPedido, calcularTotal } = require('./validators');

function createApp(pool) {
  const app = express();
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(express.json({ limit: '10kb' }));
  app.use(rateLimit({ windowMs: 60_000, limit: 300, standardHeaders: true, legacyHeaders: false }));
  app.use(express.static(path.join(__dirname, '..', 'public')));

  app.get('/health', async (_req, res) => {
    try { await pool.query('SELECT 1'); res.json({ status: 'ok', db: 'up' }); }
    catch { res.status(503).json({ status: 'erro', db: 'down' }); }
  });

  app.get('/api/produtos', async (_req, res, next) => {
    try {
      const r = await pool.query('SELECT id, nome, preco::float AS preco, disponivel FROM produtos ORDER BY id');
      res.json(r.rows);
    } catch (e) { next(e); }
  });

  app.post('/api/produtos', async (req, res, next) => {
    const erros = validarProduto(req.body);
    if (erros.length) return res.status(400).json({ erros });
    try {
      const r = await pool.query(
        'INSERT INTO produtos (nome, preco) VALUES ($1, $2) RETURNING id, nome, preco::float AS preco, disponivel',
        [req.body.nome.trim(), req.body.preco]);
      res.status(201).json(r.rows[0]);
    } catch (e) { next(e); }
  });

  app.post('/api/pedidos', async (req, res, next) => {
    const erros = validarPedido(req.body);
    if (erros.length) return res.status(400).json({ erros });
    try {
      const ids = [...new Set(req.body.itens.map(i => i.produto_id))];
      const prods = await pool.query(
        `SELECT id, preco::float AS preco, disponivel FROM produtos WHERE id IN (${ids.map((_, k) => '$' + (k + 1)).join(',')})`, ids);
      const mapa = new Map(prods.rows.map(p => [p.id, p]));
      const itens = [];
      for (const i of req.body.itens) {
        const p = mapa.get(i.produto_id);
        if (!p || !p.disponivel) return res.status(422).json({ erro: `produto ${i.produto_id} indisponível` });
        itens.push({ produto_id: p.id, quantidade: i.quantidade, preco: p.preco });
      }
      const total = calcularTotal(itens);
      const ped = await pool.query(
        'INSERT INTO pedidos (aluno, total) VALUES ($1, $2) RETURNING id, aluno, status, total::float AS total',
        [req.body.aluno.trim(), total]);
      for (const i of itens)
        await pool.query(
          'INSERT INTO itens_pedido (pedido_id, produto_id, quantidade, preco_unit) VALUES ($1,$2,$3,$4)',
          [ped.rows[0].id, i.produto_id, i.quantidade, i.preco]);
      res.status(201).json(ped.rows[0]);
    } catch (e) { next(e); }
  });

  app.get('/api/pedidos', async (_req, res, next) => {
    try {
      const r = await pool.query(
        'SELECT id, aluno, status, total::float AS total FROM pedidos ORDER BY id DESC LIMIT 100');
      res.json(r.rows);
    } catch (e) { next(e); }
  });

  app.patch('/api/pedidos/:id/status', async (req, res, next) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || !STATUS.includes(req.body.status))
      return res.status(400).json({ erro: 'id ou status inválido', validos: STATUS });
    try {
      const r = await pool.query(
        'UPDATE pedidos SET status = $1 WHERE id = $2 RETURNING id, aluno, status, total::float AS total',
        [req.body.status, id]);
      if (!r.rows.length) return res.status(404).json({ erro: 'pedido não encontrado' });
      res.json(r.rows[0]);
    } catch (e) { next(e); }
  });

  app.use((err, _req, res, _next) => {
    console.error('[erro]', err.message);
    res.status(500).json({ erro: 'erro interno' });
  });
  return app;
}

module.exports = { createApp };
