import React from 'react';
import request from 'superagent';
import Router from 'next/router';
import Link from 'next/link';
import FRC, { Input, Row } from 'formsy-react-components';
import Loading from 'react-loading';

import withAuth from '../../components/hoc/withAuth';
import config from '../../config';
import Layout from '../../components/admin/layout';
import AlertMessage from '../../components/common/alert-message';
import RenderIf from '../../components/common/render-if';

class ProvidersEdit extends React.Component {
  static getInitialProps({ query }) {
    return { query };
  }

  constructor(props) {
    super(props);
    this.state = {
      list: [],
      logo: '',
      btnEnabled: false,
      loading: true,
      showToast: false,
      messageToast: '',
      typeToast: '',
    };
    this.submitForm = this.submitForm.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
  }

  componentDidMount() {
    this.getProvider(this.props.query.id);
  }

  getProvider(id) {
    this.props.api.get(`/providers/${id}`)
        .then((response) => {
          this.setState({
            ...this.state, list: response.data
          });
          setTimeout(() => this.setState({ loading: false }), 1500);
        })
        .catch((error) => {
          this.setState({ showToast: true, typeToast: 'warning', messageToast: `Problemas ao se comunicar com API: ${error}` });
          setTimeout(() => this.setState({ showToast: false }), 2500);
        });
  }

  handleSave(event) {
    this.setState({ btnEnabled: true });
    this.handleImageUpload(event.target.files[0], event.target.name);
  }

  handleImageUpload(file, name) {
    const imageChange = {};
    const upload = request.post(config.CLOUDINARY_UPLOAD_URL)
                     .field('upload_preset', config.CLOUDINARY_UPLOAD_PRESET)
                     .field('file', file);

    upload.end((err, response) => {
      if (err) {
        this.setState({ showToast: true, typeToast: 'warning', messageToast: `Problemas ao se comunicar com API: ${err}` });
        setTimeout(() => this.setState({ showToast: false }), 2500);
      }

      if (response.body.secure_url !== '') {
        imageChange[name] = response.body.secure_url;
        this.setState(imageChange);
        this.setState({ btnEnabled: false });
      }
    });
  }

  submitForm(data) {
    const values = Object.assign(data, { logo: this.state.logo });

    if (!values.name || !values.cnpj || !values.phone || !values.email) {
      this.setState({ showToast: true, typeToast: 'warning', messageToast: 'Preencha todos os campos obrigatórios' });
      setTimeout(() => this.setState({ showToast: false }), 4500);
    }

    if (!values.logo) delete values.logo;

    const rest = this.props.api.put(`/providers/${values.id}`, values)
        .then(() => {
          this.setState({ showToast: true, typeToast: 'success', messageToast: 'Registro alterado com Sucesso' });
          setTimeout(() => Router.push('/admin/providers'), 2000);
        })
        .catch((error) => {
          this.setState({ showToast: true, typeToast: 'warning', messageToast: `Erro - (${error.message})` });
          setTimeout(() => this.setState({ showToast: false }), 2500);
        });

    return rest;
  }

  render() {
    return (
      <Layout>
        <div className="row">
          <div className="col-lg-12">
            <div className="panel panel-default">
              <div className="panel-heading">
                <span className="panel-title">Alterar Fornecedor</span>
              </div>

              <div className="panel-body">
                <RenderIf expr={this.state.loading}>
                  <div className="pull-center">
                    <Loading type="bars" color="#000000" />
                  </div>
                </RenderIf>
                <RenderIf expr={!this.state.loading}>
                  <FRC.Form onSubmit={this.submitForm} layout="vertical">
                    <Input
                      name="id"
                      value={this.state.list.id || ''}
                      type="hidden"
                    />
                    <Input
                      name="name"
                      value={this.state.list.name || ''}
                      id="name"
                      label="Nome do fornecedor"
                      type="text"
                      placeholder="Nome do fornecedor"
                      required
                      rowClassName="col-sm-12"
                    />
                    <Input
                      name="email"
                      value={this.state.list.email || ''}
                      id="email"
                      label="Email do fornecedor"
                      type="email"
                      placeholder="Email do fornecedor"
                      required
                      rowClassName="col-sm-12"
                    />
                    <Input
                      name="cnpj"
                      value={this.state.list.cnpj || ''}
                      id="cnpj"
                      label="CNPJ do fornecedor"
                      type="text"
                      placeholder="CNPJ do fornecedor"
                      required
                      rowClassName="col-sm-12"
                    />
                    <Input
                      name="responsible"
                      value={this.state.list.responsible || ''}
                      id="responsible"
                      label="Responsável do fornecedor"
                      type="text"
                      placeholder="Responsável do fornecedor"
                      rowClassName="col-sm-12"
                    />
                    <Input
                      name="phone"
                      value={this.state.list.phone || ''}
                      id="phone"
                      label="Telefone do fornecedor"
                      type="text"
                      placeholder="Telefone do fornecedor"
                      required
                      rowClassName="col-sm-12"
                    />

                    <div className="form-group col-sm-12">
                      <label
                        className="control-label"
                        htmlFor="logo"
                      >Logo</label>
                      <div className="controls">
                        <input type="file" name="logo" onChange={this.handleSave} />
                        <RenderIf expr={this.state.btnEnabled}>
                          <Loading type="bars" color="#000000" />  
                        </RenderIf>

                        <RenderIf expr={(this.state.list.logo && !this.state.logo)}> 
                          <img className="col-md-3" src={this.state.list.logo} alt="brand" />
                        </RenderIf>

                        <RenderIf expr={(this.state.logo)}> 
                          <img className="col-md-3" src={this.state.logo} alt="brand" />
                        </RenderIf>
                      </div>
                    </div>
                    <Row layout="vertical" rowClassName="col-sm-12">
                      <div className="pull-left">
                        <input className="btn btn-primary" type="submit" defaultValue="Enviar" disabled={this.state.btnEnabled ? 'disabled' : ''} />
                      </div>
                      <div className="pull-right">
                        <Link prefetch href="/admin/providers"><a className="btn btn-default">Voltar</a></Link>
                      </div>
                    </Row>
                  </FRC.Form>
                </RenderIf>
              </div>
            </div>
          </div>
        </div>
        <AlertMessage type={this.state.typeToast} show={this.state.showToast}>
          { this.state.messageToast }
        </AlertMessage>
      </Layout>
    );
  }
}

export default withAuth({ isAdminPage: true })(ProvidersEdit);
