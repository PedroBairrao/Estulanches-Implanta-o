const STATUS = ['PENDENTE', 'PREPARANDO', 'PRONTO', 'ENTREGUE', 'CANCELADO'];

function validarProduto(b = {}) {
  const erros = [];
  if (typeof b.nome !== 'string' || b.nome.trim().length < 2 || b.nome.length > 100)
    erros.push('nome deve ter entre 2 e 100 caracteres');
  if (typeof b.preco !== 'number' || !Number.isFinite(b.preco) || b.preco < 0)
    erros.push('preco deve ser um número >= 0');
  return erros;
}

function validarPedido(b = {}) {
  const erros = [];
  if (typeof b.aluno !== 'string' || b.aluno.trim().length < 2) erros.push('aluno é obrigatório');
  if (!Array.isArray(b.itens) || b.itens.length === 0) erros.push('itens deve ser uma lista não vazia');
  else b.itens.forEach((i, n) => {
    if (!Number.isInteger(i.produto_id) || i.produto_id < 1) erros.push(`itens[${n}].produto_id inválido`);
    if (!Number.isInteger(i.quantidade) || i.quantidade < 1 || i.quantidade > 50)
      erros.push(`itens[${n}].quantidade deve ser inteiro entre 1 e 50`);
  });
  return erros;
}

function calcularTotal(itens) {
  const cents = itens.reduce((s, i) => s + Math.round(i.preco * 100) * i.quantidade, 0);
  return cents / 100;
}

module.exports = { STATUS, validarProduto, validarPedido, calcularTotal };
