import { createContext, useContext, useEffect, useState } from 'react';
import { PagamentoContext } from './Pagamento';
import { UsuarioContext } from './Usuario';

export const CarrinhoContext = createContext({});
CarrinhoContext.displayName = 'Carrinho';

export const CarrinhoProvider = ({ children }) => {
  const [carrinho, setCarrinho] = useState([]);
  const [quantidadeDeProdutos, setQuantidadeDeProdutos] = useState(0);
  const [valorTotalCarrinho, setValorTotalCarrinho] = useState(0);
  return (
    <CarrinhoContext.Provider
      value={{
        carrinho,
        setCarrinho,
        quantidadeDeProdutos,
        setQuantidadeDeProdutos,
        valorTotalCarrinho,
        setValorTotalCarrinho,
      }}>
      {children}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinhoContext = () => {
  const {
    carrinho,
    setCarrinho,
    quantidadeDeProdutos,
    setQuantidadeDeProdutos,
    valorTotalCarrinho,
    setValorTotalCarrinho,
  } = useContext(CarrinhoContext);

  const { saldo, setSaldo } = useContext(UsuarioContext);

  const { formaPagamento } = useContext(PagamentoContext);

  function efetuarCompra() {
    setCarrinho([]);
    setSaldo(saldo - valorTotalCarrinho);
  }

  useEffect(() => {
    const { novaQuantidade, valorTotal } = carrinho.reduce(
      (prev, current) => ({
        novaQuantidade: prev.novaQuantidade + current.quantidade,
        valorTotal: prev.valorTotal + current.quantidade * current.valor,
      }),
      {
        novaQuantidade: 0,
        valorTotal: 0,
      },
    );
    setQuantidadeDeProdutos(novaQuantidade);
    setValorTotalCarrinho(valorTotal * formaPagamento.juros);
  }, [carrinho, formaPagamento]);

  function adicionarProduto(novoProduto) {
    const itemJaExiste = carrinho.some((item) => item.id === novoProduto.id);
    if (!itemJaExiste) {
      novoProduto.quantidade = 1;
      return setCarrinho((prevState) => [...prevState, novoProduto]);
    }
    setCarrinho(mudarCarrinho(novoProduto.id, 1));
  }

  function removerProduto(produto) {
    const produtoDoCarrinho = carrinho.find((itemDoCarrinho) => itemDoCarrinho.id === produto.id);
    if (!produtoDoCarrinho) return;
    const isUltimoProduto = produtoDoCarrinho.quantidade === 1;
    if (isUltimoProduto) {
      return setCarrinho((prevState) => prevState.filter((produtoAtual) => produtoAtual.id !== produto.id));
    }
    setCarrinho(mudarCarrinho(produto.id, -1));
  }

  function mudarCarrinho(id, quantidade) {
    return carrinho.map((item) => {
      if (item.id === id) {
        item.quantidade += quantidade;
      }
      return item;
    });
  }

  return {
    carrinho,
    setCarrinho,
    adicionarProduto,
    removerProduto,
    quantidadeDeProdutos,
    valorTotalCarrinho,
    efetuarCompra,
  };
};
