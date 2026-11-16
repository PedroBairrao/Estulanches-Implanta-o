const qtd = {};
const $ = id => document.getElementById(id);
async function carregar() {
  const prods = await (await fetch('/api/produtos')).json();
  $('cardapio').innerHTML = '';
  prods.forEach(p => {
    const li = document.createElement('li');
    li.textContent = `${p.nome} — R$ ${p.preco.toFixed(2)} `;
    const inp = document.createElement('input');
    inp.type = 'number'; inp.min = 0; inp.max = 50; inp.value = 0; inp.style.width = '4rem';
    inp.oninput = () => qtd[p.id] = Number(inp.value);
    li.appendChild(inp); $('cardapio').appendChild(li);
  });
  const peds = await (await fetch('/api/pedidos')).json();
  $('pedidos').innerHTML = '';
  peds.forEach(p => {
    const li = document.createElement('li');
    li.textContent = `#${p.id} ${p.aluno} — R$ ${p.total.toFixed(2)} — ${p.status}`;
    $('pedidos').appendChild(li);
  });
}
$('enviar').onclick = async () => {
  const itens = Object.entries(qtd).filter(([, q]) => q > 0).map(([id, q]) => ({ produto_id: Number(id), quantidade: q }));
  const r = await fetch('/api/pedidos', { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ aluno: $('aluno').value, itens }) });
  const d = await r.json();
  $('msg').textContent = r.ok ? `Pedido #${d.id} criado!` : (d.erros || [d.erro]).join('; ');
  carregar();
};
carregar();
