import { Button, Snackbar, InputLabel, Select, MenuItem } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { useContext, useMemo, useState } from 'react';
import { Container, Voltar, TotalContainer, PagamentoContainer } from './styles';
import { useCarrinhoContext } from '../../common/context/Carrinho';
import Produto from '../../components/Produto';
import { useHistory } from 'react-router-dom';
import { usePagamentoContext } from '../../common/context/Pagamento';
import { UsuarioContext } from '../../common/context/Usuario';

function Carrinho() {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const history = useHistory();
  const { carrinho, valorTotalCarrinho, efetuarCompra } = useCarrinhoContext();
  const { saldo } = useContext(UsuarioContext);
  const { formaPagamento, tiposPagamento, mudarFormaPagamento } = usePagamentoContext();
  const saldoFinal = useMemo(() => saldo - valorTotalCarrinho, [saldo, valorTotalCarrinho]);

  function voltarPagina() {
    history.goBack();
  }

  function handleClose() {
    setOpenSnackbar(false);
  }

  return (
    <Container>
      <Voltar onClick={voltarPagina} />
      <h2>Carrinho</h2>
      {carrinho.map((produto) => (
        <Produto {...produto} key={produto.id} />
      ))}
      <PagamentoContainer>
        <InputLabel> Forma de Pagamento </InputLabel>
        <Select value={formaPagamento.id} onChange={(event) => mudarFormaPagamento(event.target.value)}>
          {tiposPagamento.map((pagamento) => (
            <MenuItem key={pagamento.id} value={pagamento.id}>
              {pagamento.nome}
            </MenuItem>
          ))}
        </Select>
      </PagamentoContainer>
      <TotalContainer>
        <div>
          <h2>Total no Carrinho: </h2>
          <span>R$ {valorTotalCarrinho.toFixed(2)}</span>
        </div>
        <div>
          <h2> Saldo: </h2>
          <span> R$ {Number(saldo).toFixed(2)}</span>
        </div>
        <div>
          <h2> Saldo Total: </h2>
          <span> R$ {saldoFinal.toFixed(2)}</span>
        </div>
      </TotalContainer>
      <Button
        onClick={() => {
          setOpenSnackbar(true);
          efetuarCompra();
        }}
        disabled={!carrinho.length || saldo < valorTotalCarrinho}
        color="primary"
        variant="contained">
        Comprar
      </Button>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={openSnackbar}
        onClose={handleClose}>
        <MuiAlert onClose={handleClose} severity="success">
          Compra feita com sucesso!
        </MuiAlert>
      </Snackbar>
    </Container>
  );
}

export default Carrinho;
