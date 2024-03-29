import React from 'react';
import Router from 'next/router';
import Cookies from 'next-cookies';
import styled from 'styled-components';
import SwipeableViews from 'react-swipeable-views';
import some from 'lodash/some';

import { savesMapper } from '../utils';
import withApi from '../components/hoc/withApi';
import { Heading, Text } from '../components/common/typography';
import Button from '../components/common/button';
import Toolbar from '../components/toolbar';
import Card from '../components/card';
import Footer from '../components/footer';
import Page from '../components/common/page';
import Tabs from '../components/common/tabs';
import Tab from '../components/common/tab';
import Toast from '../components/common/toast';
import Container from '../components/common/container';
import LoginModal from '../components/auth/login-modal';
import SubscriptionConfirmationModal
  from '../components/saves/subscription-confirmation-modal';
import { colors } from '../components/styles/variables';
import FeedbackModal from '../components/common/feedback-modal';

const CardsList = styled(Container)`
  align-items: stretch;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  flex-flow: row wrap;
`;

export const StyledCard = styled(Card)`
  @media (min-width: 480px) {
    flex: 1;
    flex-basis: calc(50% - 10px);
    max-width: calc(50% - 10px);
    margin: 36px 5px 0;

    &:nth-child(3n + 1) {
      margin-left: 0;
    }

    &:nth-child(3n + 2) {
      margin-right: 0;
    }
  }

  @media (min-width: 960px) {
    flex-basis: calc(33.3% - 10px);
    max-width: calc(33.3% - 10px);

    &:nth-child(3n + 2) {
      margin-right: 5px;
    }

    &:nth-child(3n + 3) {
      margin-right: 0;
    }
  }
`;

const BlankState = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: 0 auto;
  min-height: calc(100vh - 100px);
  padding: 60px 30px;
  text-align: center;
  max-width: 480px;

  @media (min-width: 640px) {
    padding: 150px 30px;
  }

  > h1 {
    margin: 0 20px;
  }
`;

export class Saves extends React.Component {
  static async getInitialProps(ctx) {
    const items = await ctx.api.get('/saves/active');
    const saves = savesMapper(items.data);
    const { modalFeedbackShow } = Cookies(ctx);
    return { saves, modalFeedbackShow };
  }

  constructor(props) {
    super(props);

    this.state = {
      user: {},
      loginModalIsOpen: false,
      activeTab: this.props.url.query.t && this.props.isSignedIn ? parseInt(this.props.url.query.t) : 0,
      saves: props.saves,
      subscriptions: {
        count: 0,
        rows: []
      },
      subscribeTo: undefined,
      showToast: false,
      subscriptionConfirmationModalIsOpen: false,
      currentSubscribeTarget: null
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleChangeIndex = this.handleChangeIndex.bind(this);
    this.loadSaves = this.loadSaves.bind(this);
    this.loadSubscriptions = this.loadSubscriptions.bind(this);
    this.handleSubscribe = this.handleSubscribe.bind(this);
    this.handleSubscribeConfirm = this.handleSubscribeConfirm.bind(this);
    this.handleSubscribeCancel = this.handleSubscribeCancel.bind(this);
  }

  componentDidMount() {
    if (this.props.isSignedIn) {
      this.loadSaves();
      this.loadSubscriptions();
    }
    if (!this.props.modalFeedbackShow) {
      this.feedbackmodal.open();
      document.cookie = 'modalFeedbackShow=true'
    }
  }

  handleSubscribe(subscribeTo) {
    this.setState({
      subscriptionConfirmationModalIsOpen: true,
      currentSubscribeTarget: subscribeTo
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isSignedIn !== this.props.isSignedIn) {
      this.loadSaves();
      this.closeModal();

      this.loadSubscriptions().then(() => {
        const { currentSubscribeTarget, subscriptions } = this.state;
        const isSubscribedOnCurrentSave = some(subscriptions.rows, {
          id: currentSubscribeTarget
        });
        if (currentSubscribeTarget && !isSubscribedOnCurrentSave) {
          this.handleSubscribe(currentSubscribeTarget);
        }
      });
    }
  }

  handleSubscribe(subscribeTo) {
    this.setState({
      subscriptionConfirmationModalIsOpen: true,
      currentSubscribeTarget: subscribeTo
    });
  }

  handleSubscribeConfirm(subscribeTo) {
    return this.props.api
      .post(`/saves/${subscribeTo}/subscriptions`)
      .then(() => {
        this.loadSaves();
        this.loadSubscriptions();

        this.setState({
          showToast: true
        });

        setTimeout(() => this.setState({ showToast: false }), 4000);
      });
  }

  handleSubscribeCancel() {
    this.setState({
      subscriptionConfirmationModalIsOpen: false,
      currentSubscribeTarget: null
    });
  }

  goToOffers(slug) {
    Router.push(`/offer?saveId=${slug}`, `/offer/${slug}`);
  }

  handleChangeIndex(tabIndex) {
    window.history.pushState({}, '', `?t=${tabIndex}`);
    this.setState({ activeTab: tabIndex });
  }

  loadSaves() {
    return this.props.api
      .get('/saves/active')
      .then(res => res.data)
      .then(saves => savesMapper(saves))
      .then((saves) => {
        this.setState({ saves });
      });
  }

  loadSubscriptions() {
    return this.props.api
      .get('/saves/subscribed')
      .then(res => res.data)
      .then(saves => savesMapper(saves))
      .then((subscriptions) => {
        this.setState({ subscriptions });
      });
  }

  openModal(subscribeTo) {
    this.setState({
      loginModalIsOpen: true,
      currentSubscribeTarget: subscribeTo
    });
  }

  closeModal() {
    this.setState({ loginModalIsOpen: false });
  }

  renderUserSaves() {
    return this.state.subscriptions.rows.length > 0
      ? this.state.subscriptions.rows.map(save => (
        <StyledCard
          {...save}
          key={save.id}
          logged={this.props.isSignedIn}
          openLoginModal={() => this.openModal(save.id)}
          handleSubscribe={() => this.handleSubscribe(save.id)}
          goToOffers={() => this.goToOffers(save.slug)}
          winnerProduct={save.winnerProduct}
          api={this.props.api}
        />
        ))
      : <BlankState>
        <Heading color={colors.white}>Ainda não tem nenhum save???</Heading>
          <Text color={colors.white}>
            O que você está esperando? Escolha os produtos que te interessam e participe do grupo que conseguirá os melhores descontos do mercado!
          </Text>
        <div>
          <Button outline onClick={() => this.handleChangeIndex(0)}>
              Ver todos os saves
            </Button>
        </div>
      </BlankState>;
  }

  render() {
    return (
      <Page hasFooter>
        <Toolbar
          logged={this.props.isSignedIn}
          onLogout={this.props.onLogout}
        />

        {this.props.isSignedIn &&
          <Tabs
            withBorder
            index={this.state.activeTab}
            onChange={this.handleChangeIndex}
          >
            <Tab>Saves Abertos</Tab>
            <Tab>Meus Saves</Tab>
          </Tabs>}

        <SwipeableViews
          disabled={!this.props.isSignedIn}
          index={this.state.activeTab}
          onChangeIndex={this.handleChangeIndex}
          animateHeight
        >
          <CardsList>
            {this.state.saves.rows &&
              this.state.saves.rows.map(save => (
                <StyledCard
                  {...save}
                  key={save.id}
                  logged={this.props.isSignedIn}
                  openLoginModal={() => this.openModal(save.id)}
                  handleSubscribe={() => this.handleSubscribe(save.id)}
                  goToOffers={() => this.goToOffers(save.slug)}
                />
              ))}
          </CardsList>

          <CardsList>
            {this.renderUserSaves()}
          </CardsList>
        </SwipeableViews>

        <Footer marginTop />

        <LoginModal
          isOpen={this.state.loginModalIsOpen}
          onClose={this.closeModal}
        />

        <FeedbackModal
          ref={instance => { this.feedbackmodal = instance; }}
          title="Estamos apenas começando..."
          subtitle="A <span style='color:#28ba64'>99saves.com</span> acaba de ser lançada e estes são apenas os primeiros Saves cadastrados em nossa plataforma. Aos poucos vamos incluindo novas categorias de produtos e você será informado. <br/><br/> Fique de olho!"/>

        <SubscriptionConfirmationModal
          isOpen={this.state.subscriptionConfirmationModalIsOpen}
          subscribeTo={this.state.currentSubscribeTarget}
          onConfirm={this.handleSubscribeConfirm}
          onClose={this.handleSubscribeCancel}
        />

        <Toast show={this.state.showToast}>
          Você receberá um email com atualizações sobre esta negociação.
        </Toast>
      </Page>
    );
  }
}

export default withApi()(Saves);
