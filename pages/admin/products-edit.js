import React from 'react';
import request from 'superagent';
import Router from 'next/router';
import moment from 'moment';
import FRC, { Input, Row, Textarea, Select } from 'formsy-react-components';
import Loading from 'react-loading';
import CurrencyInput from 'react-currency-input';
import every from 'lodash/every';

import RenderIf from '../../components/common/render-if';
import withAuth from '../../components/hoc/withAuth';
import config from '../../config';
import Layout from '../../components/admin/layout';
import AlertMessage from '../../components/common/alert-message';

class ProductsCreate extends React.Component {
  static getInitialProps({ query }) {
    return { query };
  }

  constructor(props) {
    super(props);
    this.state = {
      image_default: '',
      image2: '',
      image3: '',
      startDate: '',
      price: '',
      priceBuscape: '',
      list: [],
      btnEnabled: false,
      loading: true,
      showToast: false,
      messageToast: '',
      typeToast: '',
      selectOptions: [],
      selectProvider: []
    };
    this.submitForm = this.submitForm.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
    this.handlePriceChange = this.handlePriceChange.bind(this);
    this.getSaves();
    this.getProvider();
  }


  componentDidMount() {
    this.getProducts(this.props.query.id);
    setTimeout(() => this.setState({ loading: false }), 1500);
  }

  getProducts(id) {
    this.props.api.get(`/products/${id}`)
        .then((response) => {
          this.setState({
            ...this.state, list: response.data
          });
          this.setState({ price: this.state.list.price || '', priceBuscape: this.state.list.price_buscape || '' });
          setTimeout(() => this.setState({ loading: false }), 1500);
        })
        .catch((error) => {
          this.setState({ showToast: true, typeToast: 'warning', messageToast: `Problemas ao se comunicar com API: ${error}` });
          setTimeout(() => this.setState({ showToast: false }), 2500);
        });
  }

  getSaves() {
    let list = [{ value: '', label: 'Selecione um registro' }];
    this.props.api.get('/saves/all')
        .then((response) => {
          response.data.map( (item) => {
            list.push({ value: item.id, label: item.title});
          });
          this.setState({ selectOptions: list });
        })
        .catch((error) => {
          console.log(error);
        });
  }

  getProvider() {
    let list = [{ value: '', label: 'Selecione um registro' }];
    this.props.api.get('/providers')
        .then((response) => {
          response.data.rows.map( (item) => {
            list.push({ value: item.id, label: item.name});
          });
          this.setState({ selectProvider: list });
        })
        .catch((error) => {
          console.log(error);
        });
  }

  handleSave(event) {
    this.setState({ btnEnabled: true });
    this.handleImageUpload(event.target.files[0], event.target.name);
  }

  handlePriceChange(key) {
    return (value) => this.setState({ [key]: value })
  }

  handleImageUpload(file, name) {
    const imageChange = {};
    const upload = request.post(config.CLOUDINARY_UPLOAD_URL)
                     .field('upload_preset', config.CLOUDINARY_UPLOAD_PRESET)
                     .field('file', file);

    upload.end((err, response) => {
      if (err) {
        this.setState({ showToast: true, typeToast: 'warning', messageToast: `Problemas ao se comunicar com API: ${err}` });
        this.setState({ btnEnabled: false });
        setTimeout(() => this.setState({ showToast: false }), 2500);
      }

      if (response.body.secure_url !== '') {
        imageChange[name] = response.body.secure_url;
        this.setState({ btnEnabled: false });
        this.setState(imageChange);
      }
    });
  }

  isFormValid(values) {
    return every(
      ['title', 'price', 'link_buy', 'SaveId', 'ProviderId', 'Coupons', 'method_payment'],
      key => this.state[key] !== ''
    );
  }

  submitForm(data) {
    const values = Object.assign(data, {
      image_default: this.state.image_default,
      image2: this.state.image2,
      image3: this.state.image3,
      price: this.state.price.toLocaleString().replace(".", "").replace(",", "."),
      price_buscape: this.state.priceBuscape.toLocaleString().replace(".", "").replace(",", ".")
    });

    if (!values.image_default) delete values.image_default;
    if (!values.image2) delete values.image2;
    if (!values.image3) delete values.image3;

    if (!this.isFormValid(values) && (values.image_default ? values.image_default : this.state.list.image_default)) {
      this.setState({
        showToast: true,
        typeToast: 'warning',
        messageToast: 'Preencha todos os campos obrigatórios'
      });
      setTimeout(() => this.setState({ showToast: false }), 4500);
      return;
    }

    const rest = this.props.api.put(`/products/${values.id}`, values)
        .then(() => {
          this.setState({ showToast: true, typeToast: 'success', messageToast: 'Registro cadastrado com Sucesso' });
          setTimeout(() => Router.push('/admin/products'), 2000);
        })
        .catch((error) => {
          this.setState({ showToast: true, typeToast: 'warning', messageToast: `Erro ao inserir (${error.message})` });
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
                <span className="panel-title">Alterar Produto</span>
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
                      name="title"
                      value={this.state.list.title || ''}
                      id="title"
                      label="Título do produto"
                      type="text"
                      placeholder="Título do produto"
                      required
                      rowClassName="col-sm-12"
                    />
                    <div className="form-group col-sm-12">
                      <label className="control-label" htmlFor="price">
                        Preço *
                      </label>
                      <div className="controls">
                        <CurrencyInput
                          name="price"
                          value={this.state.price}
                          id="price"
                          label="Preço"
                          placeholder="Preço"
                          className="form-control col-sm-3"
                          decimalSeparator=","
                          thousandSeparator="."
                          required
                          onChange={this.handlePriceChange('price')}
                        />
                      </div>
                    </div>
                    <Input
                      name="method_payment"
                      value={this.state.list.method_payment || ''}
                      id="method_payment"
                      label="Formas de pagamentos"
                      type="text"
                      placeholder="Formas de pagamentos"
                      required
                      rowClassName="col-sm-12"
                    />
                    <Input
                      name="link_buscape"
                      value={this.state.list.link_buscape || ''}
                      id="link_buscape"
                      label="Link Buscapé"
                      type="text"
                      placeholder="Link Buscapé"
                      rowClassName="col-sm-12"
                    />
                    <div className="form-group col-sm-12">
                      <label className="control-label" htmlFor="price_buscape">
                        Preço Buscapé
                      </label>
                      <div className="controls">
                        <CurrencyInput
                          name="price_buscape"
                          value={this.state.priceBuscape}
                          id="price_buscape"
                          label="Menor preço buscapé"
                          placeholder="Menor preço buscapé"
                          className="form-control col-sm-3"
                          decimalSeparator=","
                          thousandSeparator="."
                          onChange={this.handlePriceChange('priceBuscape')}
                        />
                      </div>
                    </div>
                    <Input
                      name="link_buy"
                      value={this.state.list.link_buy || ''}
                      id="link_buy"
                      label="link para compra na loja"
                      type="text"
                      placeholder="link para compra na loja"
                      required
                      rowClassName="col-sm-12"
                    />
                    <Select
                      name="SaveId"
                      value={this.state.list.SaveId || ''}
                      label="Save"
                      id="saveid"
                      help="Campo obriagatório"
                      options={this.state.selectOptions}
                      required
                      rowClassName="col-sm-12"
                    />
                    <Select
                      name="ProviderId"
                      value={this.state.list.ProviderId || ''}
                      label="Fornecedor"
                      id="providerd"
                      help="Campo obriagatório"
                      options={this.state.selectProvider}
                      required
                      rowClassName="col-sm-12"
                    />
                    <Textarea
                      rows={10}
                      cols={40}
                      name="description"
                      value={this.state.list.description || ''}
                      label="Descrição do produto"
                      placeholder="Descrição"
                      rowClassName="col-sm-12"
                    />
                    <Textarea
                      rows={10}
                      cols={40}
                      name="technique_information"
                      value={this.state.list.technique_information || ''}
                      label="Informações técnicas"
                      placeholder="Informações técnicas"
                      rowClassName="col-sm-12"
                    />
                    <div className="form-group col-sm-12">
                      <label
                        className="control-label"
                        htmlFor="image_default"
                      >Imagem de destaque *</label>
                      <div className="controls">
                        <input type="file" name="image_default" onChange={this.handleSave} />
                        <RenderIf expr={(!!this.state.list.image_default && !this.state.image_default)}>
                          <img className="col-md-3" src={this.state.list.image_default} alt="image" />
                        </RenderIf>

                        <RenderIf expr={(!!this.state.image_default)}>
                          <img className="col-md-3" src={this.state.image_default} alt="image" />
                        </RenderIf>
                      </div>
                    </div>
                    <div className="form-group col-sm-12">
                      <label className="control-label" htmlFor="image2">Outra imagem</label>
                      <div className="controls">
                        <input type="file" name="image2" onChange={this.handleSave} />
                        <RenderIf expr={(!!this.state.list.image2 && !this.state.image2)}>
                          <img className="col-md-3" src={this.state.list.image2} alt="image" />
                        </RenderIf>

                        <RenderIf expr={(!!this.state.image2)}>
                          <img className="col-md-3" src={this.state.image2} alt="image" />
                        </RenderIf>
                      </div>
                    </div>
                    <div className="form-group col-sm-12">
                      <label className="control-label" htmlFor="image3">Outra imagem</label>
                      <div className="controls">
                        <input type="file" name="image3" onChange={this.handleSave} />
                        <RenderIf expr={(!!this.state.list.image3 && !this.state.image3)}>
                          <img className="col-md-3" src={this.state.list.image3} alt="image" />
                        </RenderIf>

                        <RenderIf expr={(!!this.state.image3)}>
                          <img className="col-md-3" src={this.state.image3} alt="image" />
                        </RenderIf>
                      </div>
                    </div>
                    <RenderIf expr={this.state.btnEnabled}>
                      <div className="form-group col-sm-12">
                        <Loading type="bars" color="#000000" />
                      </div>
                    </RenderIf>
                    <Row layout="vertical" rowClassName="col-sm-12">
                      <div className="text-left">
                        <input
                          className="btn btn-primary"
                          type="submit"
                          defaultValue="Enviar"
                          disabled={this.state.btnEnabled ? 'disabled' : ''}
                        />
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

export default withAuth({ isAdminPage: true })(ProductsCreate)
