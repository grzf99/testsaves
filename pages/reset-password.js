import React, { Component } from 'react';
import Router from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import withApi from '../components/hoc/withApi';
import AuthPage from '../components/auth/auth-page';
import RenderIf from '../components/common/render-if';
import Form from '../components/common/form';
import Input from '../components/common/input';
import Button from '../components/common/button';
import { Heading, Text, Heading2, FormAlert } from '../components/common/typography';
import { colors } from '../components/styles/variables';
import { minLength } from '../utils/validation';

const Header = styled.div`
  padding-bottom: 30px;
`;

const Title = styled(Heading)`
  line-height: 1.47;

  @media (max-width: 480px) {
    font-size: 30px;
  }
`;

const Footer = styled.div`
  display: flex;
  padding-top: 15px;
`;

const CreateAccountText = styled(Text)`
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  color: ${colors.green};
  text-align: right;
  text-transform: uppercase;
  cursor: pointer;
`;

const SubmitButton = styled(Button)`
  color: ${colors.gray};
  margin-top: 27px;
  flex: 1;

  &:hover {
    color: ${colors.white};
  }
`;

const FormHeader = styled.div`
  padding-bottom: 30px;
`;

const FormContainer = styled.div`
  background: white;
  padding: 36px;
`;

const FormFooter = styled.div`
  padding: 16px 0;
  text-align: center;
`;

class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 1,
      loading: false,
      password: '',
      password_verify: '',
      validPassword: false,
      errorApi: false
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange({ target }) {
    this.setState({ [target.name]: target.value });
  }

  handleSubmit() {
    if(!this.isEqualPassword()) {
      this.setState({validPassword: true});
    } else {
      const password = this.state.password;
      const token = this.props.url.query.token;
      this.props.api.post('/auth/reset-password', { token, password }).then(() => {
        this.setState({ step: 2, loading: false, errorApi: false });
      })
      .catch(error => {
        this.setState({ errorApi: true, loading: false });
      });
    }
  }

  isFormValid() {
    return this.state.password !== '' && 
           this.state.password_verify !== '';
  }

  isEqualPassword() {
     return this.state.password === this.state.password_verify;
  }

  renderStep1() {
    return (
      <div>
        <FormContainer>
          <FormHeader>
            <Title large uppercase>Atualizar senha</Title>
            <Heading2 uppercase fontWeight="500" color={colors.lightgray}>
              Digite uma nova senha
            </Heading2>
          </FormHeader>
          <Form onSubmit={this.handleSubmit}>
            <RenderIf expr={this.state.errorApi}>
              <FormAlert>Token inválido, solicite o esqueci minha senha novamente.</FormAlert>
            </RenderIf>
            {this.state.validPassword
              ? <FormAlert>Digite a mesma senha nos 2 campos.</FormAlert>
              : null}
            <Input
              block
              name="password"
              type="password"
              label="Nova Senha"
              placeholder="Nova senha"
              hint="Sua senha deve ter ao menos 8 dígitos, além de letras e números"
              onChange={this.handleChange}
              value={this.state.password}
              validation={minLength(8)}
            />
            <Input
              block
              name="password_verify"
              type="password"
              label="Repetir Senha"
              placeholder="Repetir a nova senha"
              onChange={this.handleChange}
              value={this.state.password_verify}
              validation={minLength(8)}
            />
          </Form>
          <Button
            block
            large
            disabled={!this.isFormValid()}
            onClick={this.handleSubmit}
          >
            Atualizar senha
          </Button>
        </FormContainer>
      </div>
    );
  }

  renderStep2() {
    return (
      <div>
        <FormContainer>
          <Title large uppercase>Senha Atualizada</Title>
          <Text color={colors.lightgray} uppercase>
            Tudo ceerto!
          </Text>
          <Footer>
            <Link prefetch href="/login">
              <SubmitButton outline block large>Ir para login</SubmitButton>
            </Link>
          </Footer>
        </FormContainer>
      </div>
    );
  }

  render() {
    return (
      <AuthPage>
        {this.state.step === 1 ? this.renderStep1() : null}
        {this.state.step === 2 ? this.renderStep2() : null}
      </AuthPage>
    );
  }
}

export default withApi()(ResetPassword);