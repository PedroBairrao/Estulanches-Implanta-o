const { validarProduto, validarPedido, calcularTotal } = require('../../src/validators');

describe('validarProduto', () => {
  test('aceita produto válido', () => expect(validarProduto({ nome: 'Coxinha', preco: 6 })).toEqual([]));
  test('rejeita nome curto', () => expect(validarProduto({ nome: 'a', preco: 1 })).toHaveLength(1));
  test('rejeita preço negativo ou string', () => {
    expect(validarProduto({ nome: 'Suco', preco: -1 })).toHaveLength(1);
    expect(validarProduto({ nome: 'Suco', preco: '5' })).toHaveLength(1);
  });
});

describe('validarPedido', () => {
  test('aceita pedido válido', () =>
    expect(validarPedido({ aluno: 'Ana', itens: [{ produto_id: 1, quantidade: 2 }] })).toEqual([]));
  test('rejeita itens vazios', () => expect(validarPedido({ aluno: 'Ana', itens: [] }).length).toBeGreaterThan(0));
  test('rejeita quantidade inválida', () =>
    expect(validarPedido({ aluno: 'Ana', itens: [{ produto_id: 1, quantidade: 0 }] })).toHaveLength(1));
});

describe('calcularTotal', () => {
  test('soma sem erro de ponto flutuante', () =>
    expect(calcularTotal([{ preco: 0.1, quantidade: 3 }, { preco: 4.5, quantidade: 2 }])).toBe(9.3));
});
