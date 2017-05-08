import React from 'react';
import request from 'superagent';
import Router from 'next/router';
import moment from 'moment';
import FRC, { Input, Row, Textarea } from 'formsy-react-components';
import Loading from 'react-loading';

import withAuth from '../../components/hoc/withAuth';
import config from '../../config';
import Layout from '../../components/admin/layout';
import AlertMessage from '../../components/common/alert-message';
import RenderIf from '../../components/common/render-if';

class SavesEdit extends React.Component {
  static getInitialProps({ query }) {
    return { query };
  }

  constructor(props) {
    super(props);
    this.state = {
      image_default: '',
      startDate: '',
      list: [],
      loading: true,
      showToast: false,
      messageToast: '',
      typeToast: '',
    };
    this.getSaves = this.getSaves.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.handleSave = this.handleSave.bind(this);
    this.handleImageUpload = this.handleImageUpload.bind(this);
  }

  componentDidMount() {
    this.getSaves(this.props.query.id);
  }

  getSaves(id) {
    this.props.api.get(`/saves/${id}`)
        .then((response) => {
          this.setState({
            ...this.state, list: response.data
          });
          setTimeout(() => this.setState({ loading: false }), 1500);
        })
        .catch((error) => {
          this.setState({ showToast: true, typeToast: 'warning', messageToast: `Problemas ao se comunicar com API: ${error.message}` });
          setTimeout(() => this.setState({ showToast: false }), 2500);
        });
  }

  handleSave(event) {
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

  submitForm(data) {
    const values = Object.assign(data, {
      image_default: this.state.image_default,
      date_start: moment(data.date_start, moment.ISO_8859).format(),
      date_end: moment(data.date_end, moment.ISO_8859).format()
    });

    if (!values.title || !values.date_start || !values.date_end) {
      return alert('Preencha todos os campos obrigatórios');  // eslint-disable-line
    }

    if (!values.image_default) delete values.image_default;

    const rest = this.props.api.put(`/saves/${values.id}`, values)
        .then(() => {
          this.setState({ showToast: true, typeToast: 'success', messageToast: 'Registro alterado com Sucesso' });
          setTimeout(() => Router.push('/admin/saves'), 2500);
        })
        .catch((error) => {
          this.setState({ showToast: true, typeToast: 'warning', messageToast: `Err ao alterar o registro ${error.message}` });
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
                <span className="panel-title">Alterar Save</span>
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
                      id="title"
                      value={this.state.list.title || ''}
                      label="Título do save"
                      type="text"
                      placeholder="Título do save"
                      required
                      rowClassName="col-sm-12"
                    />
                    <Input
                      name="date_start"
                      value={moment(this.state.list.date_start).format('YYYY-MM-DD') || ''}
                      label="Data início do save"
                      type="date"
                      required
                      rowClassName="col-sm-6"
                    />
                    <Input
                      name="date_end"
                      value={moment(this.state.list.date_end).format('YYYY-MM-DD') || ''}
                      label="Data finalização do save"
                      type="date"
                      required
                      rowClassName="col-sm-6"
                    />
                    <Textarea
                      rows={3}
                      cols={40}
                      name="description"
                      value={this.state.list.description || ''}
                      label="Descrição do save"
                      placeholder="Descrição"
                      rowClassName="col-sm-12"
                    />
                    <div className="form-group col-sm-12">
                      <label
                        className="control-label"
                        htmlFor="image_default"
                      >Imagem de destaque</label>
                      <div className="controls">
                        <input type="file" name="image_default" onChange={this.handleSave} />
                      </div>
                    </div>
                    <Row layout="vertical" rowClassName="col-sm-12">
                      <div className="text-left">
                        <input className="btn btn-primary" type="submit" defaultValue="Enviar" />
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

export default withAuth({ isAdminPage: true })(SavesEdit);
