const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { createApp } = require('./app');

async function conectar(pool, tentativas = 15) {
  for (let i = 1; i <= tentativas; i++) {
    try { await pool.query('SELECT 1'); return; }
    catch (e) { console.log(`[db] aguardando banco (${i}/${tentativas})`); await new Promise(r => setTimeout(r, 2000)); }
  }
  throw new Error('banco indisponível');
}

(async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: Number(process.env.DB_POOL_MAX || 10) });
  await conectar(pool);
  await pool.query(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));
  const { rows } = await pool.query('SELECT COUNT(*)::int AS n FROM produtos');
  if (rows[0].n === 0)
    await pool.query(`INSERT INTO produtos (nome, preco) VALUES
      ('Pão de queijo', 4.50), ('Coxinha', 6.00), ('Suco natural', 5.00), ('Misto quente', 7.50)`);
  const port = Number(process.env.PORT || 3000);
  createApp(pool).listen(port, () => console.log(`[app] EstuLanches v${process.env.APP_VERSION || '1.0.0'} na porta ${port}`));
})().catch(e => { console.error('[fatal]', e.message); process.exit(1); });
