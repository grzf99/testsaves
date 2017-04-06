import styled from 'styled-components';
import srcSet from '../utils/srcSet';
import { colors } from './styles/variables';
import Button from './common/button';

const Toolbar = styled.header`
  background: ${colors.black};
  display: flex;
  justify-content: space-between;
  padding: 11px;
  width: 100%;
  height: 52px;
`;

const Logo = styled.img`
  margin-left: 5px;
`;

export default () => (
  <Toolbar>
    <Logo src="/static/images/logo-99-saves.png" srcSet={srcSet('logo-99-saves.png')} alt="99saves" />
    <Button small outline>login</Button>
  </Toolbar>
);
