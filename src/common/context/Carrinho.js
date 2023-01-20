import { createContext, useContext, useEffect, useState } from 'react';

export const CarrinhoContext = createContext();
CarrinhoContext.displayName = 'Carrinho';

export const CarrinhoProvider = ({ children }) => {
  const [carrinho, setCarrinho] = useState([]);
  const [quantidadeDeProdutos, setQuantidadeDeProdutos] = useState(0);
  return (
    <CarrinhoContext.Provider value={{ carrinho, setCarrinho, quantidadeDeProdutos, setQuantidadeDeProdutos }}>
      {children}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinhoContext = () => {
  const { carrinho, setCarrinho, quantidadeDeProdutos, setQuantidadeDeProdutos } = useContext(CarrinhoContext);
  useEffect(() => {
    setQuantidadeDeProdutos(carrinho.reduce((prev, current) => prev + current.quantidade, 0));
  });

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

  return { carrinho, setCarrinho, adicionarProduto, removerProduto, quantidadeDeProdutos };
};
