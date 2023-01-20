import { Nav } from './styles';
import { ReactComponent as Logo } from 'assets/logo.svg';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import { CarrinhoContext } from '../../../common/context/Carrinho';
import { useContext } from 'react';
import { useHistory } from 'react-router-dom';

export default function NavBar() {
  const { quantidadeDeProdutos } = useContext(CarrinhoContext);
  const history = useHistory();

  function irProCarrinho() {
    history.push('/carrinho');
  }

  return (
    <Nav>
      <Logo />
      <IconButton onClick={irProCarrinho}>
        <Badge color="primary" badgeContent={quantidadeDeProdutos}>
          <ShoppingCartIcon />
        </Badge>
      </IconButton>
    </Nav>
  );
}
