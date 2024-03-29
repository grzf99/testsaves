import React from 'react';
import Router from 'next/router';
import styled from 'styled-components';
import some from 'lodash/some';

import { savesMapper } from '../utils';
import withApi from '../components/hoc/withApi';
import { colors } from '../components/styles/variables';
import { Heading } from '../components/common/typography';
import Button from '../components/common/button';
import Toolbar from '../components/toolbar';
import Card from '../components/card';
import Footer from '../components/footer';
import Toast from '../components/common/toast';
import Container from '../components/common/container';
import LoginModal from '../components/auth/login-modal';
import ForgotPasswordModal from '../components/auth/forgot-password-modal';
import Modal from '../components/common/modal';
import RenderIf from '../components/common/render-if';
import SubscriptionConfirmationModal from '../components/saves/subscription-confirmation-modal';
import FeedbackModal from '../components/common/feedback-modal';

const Page = styled.div`
  background: ${colors.black};
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  width: 100%;
`;

const CardsList = styled(Container)`
  align-items: stretch;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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

const ModalVideoContent = styled.div`
  > * + * {
    position: relative;
    padding-bottom: 56.25%;
    padding-top: 25px;
    height: 0;
    margin-top: 25px !important;
  }

  > iframe {
    border: 0;
    padding: 0;
    margin: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const ModalHeading = styled(Heading)`
  margin: 16px 5px 0;
`;

const Bullet = styled.span`
  color: ${colors.green};
  margin: 0 10px;
  &:after {
    content: '•'
  }
`;

const modalStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  },
  content: {
    top: '50%',
    left: '20px',
    right: '20px',
    bottom: 'auto',
    border: '0',
    transform: 'translateY(-50%)',
    borderRadius: '0',
    maxWidth: '480px',
    margin: '0 auto'
  }
};

const modalVideoStyles = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  },
  content: {
    top: '15%',
    left: '50%',
    right: '20px',
    bottom: '0',
    background: 'transparent',
    transform: 'translateX(-50%)',
    border: '0',
    borderRadius: '0',
    maxHeight: '400px',
    maxWidth: '640px',
    padding: 0,
    width: '90%'
  }
};

const Banner = styled.div`
  background: ${colors.black} url(/static/images/img-header@2x.png) no-repeat center center;
  background-size: cover;
  margin-top: 0;
  min-height: 626px;
  position: relative;
  &:after {
    content: "";
    position: absolute;
    bottom: -17px;
    right: 0;
    width: 100%;
    height: 35px;
    background: ${colors.white};
    border-left: 0;
    border-right: 50px solid transparent;
    border-top: 25px solid ${colors.white};
    transform: rotate(179deg);
  }
`;

const BannerContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 450px;
  justify-content: space-around;
  margin-top: 30px;
`;

const Title = styled.h1`
  color: ${colors.white};
  text-align: center;
  font-family: Oswald;
  font-size: 72px;
  font-weight: 500;
  text-transform: uppercase;
  @media (max-width: 500px) {
    font-size: 47px;
  }
`;

const Subtitle = styled.div`
  color: ${colors.white};
  font-family: Roboto;
  font-size: 18px;
  font-weight: 500;
  line-height: 1.67;
  max-width: 670px;
  text-align: center;
  width: 100%;
  @media (max-width: 960px) {
    width: 100%;
  }
`;

const BannerActions = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  width: 500px;
  @media (max-width: 500px) {
    flex-direction: column;
    height: 130px;
    width: 100%;
  }
`;

const VideoButton = styled(Button)`
  background-image: url(/static/images/ic-play.svg);
  background-position: 20px center;
  background-repeat: no-repeat;
  font-size: 14px;
  padding-left: 50px;
`;

const BrandContainer = styled.div`
  align-items: center;
  background: ${colors.white};
  display: flex;
  flex-direction: column;
  min-height: 610px;
  justify-content: flex-start;
  position: relative;
  &:after {
    content: "";
    position: absolute;
    bottom: -20px;
    right: 0;
    width: 100%;
    height: 80px;
    background: ${colors.white};
    border-left: 0;
    border-right: 50px solid transparent;
    border-top: 5px solid #ffffff;
    transform: rotate(1.2deg);
  }
  @media (max-width: 728px) {
    min-height: 1000px;
  }
`;

const BannerTitle = styled.h2`
  color: ${colors.black};
  font-family: Oswald;
  font-size: 38px;
  font-weight: 500;
  line-height: 1.26;
  margin-bottom: 0;
  text-align: center;
  text-transform: uppercase;
  @media (max-width: 500px) {
    font-size: 22px;
  }
`;

const BannerSubTitle = styled.p`
  color: ${colors.gray};
  font-family: Roboto;
  font-size: 18px;
  font-weight: 500;
  text-align: center;
  text-transform: uppercase;
  @media (max-width: 500px) {
    font-size: 15px;
  }
`;

const BannerSubTitleHash = styled.p`
  color: ${colors.white};
  background-color: ${colors.green};
  font-family: Roboto;
  padding: 10px 30px;
  display: block;
  font-size: 28px;
  font-weight: bold;
  text-align: center;
  font-style: italic;
  margin: 65px 0;
  text-transform: uppercase;
  position: relative;

  &:before {
    content: '';
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 60px 15px 0 0;
    border-color: #ffffff transparent transparent transparent;
    position: absolute;
    left: 0px;
    top: 0px;
    z-index: 1;
  }

  &:after {
    content: '';
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 0 0 60px 15px;
    border-color: transparent transparent #ffffff transparent;
    position: absolute;
    right: 0px;
    top: 0px;
    z-index: 1;
  }

  @media (max-width: 500px) {
    font-size: 26px;
  }
`;

const BrandImagesContainer = styled(Container)`
  align-content: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 20px;
  @media (max-width: 728px) {
    flex-direction: column;
    min-height: 250px;
  }
`;

const BrandImage = styled.img`
  align-self: center;
`;

const WeAreNotContainer = styled(Container)`
  align-content: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-top: 50px;
  @media (max-width: 728px) {
  }
`;

const WeAreNot = styled.div`
  text-align: center;
  position: relative;
`;

const WeAreNotSubtitle = styled.span`
  background: ${colors.green};
  bottom: -25px;
  color: ${colors.white};
  font-family: 'Oswald', sans-serif;
  font-size: 36px;
  font-weight: bold;
  padding: 5px 22px;
  text-align: center;
  text-transform: uppercase;
  position: relative;

  @media (max-width: 480px) {
    bottom: -10px;
  }
`;

const WeAreNotTitle = styled.h5`
  color: ${colors.darkGreyBlue};
  font-family: 'Oswald', sans-serif;
  font-size: 72px;
  font-weight: bold;
  letter-spacing: 5px;
  margin: 0;
  padding: 0;
  text-align: center;
  text-transform: uppercase;

  @media (max-width: 480px) {
    line-height: 1;
  }
`;

const WeAreNotDescription = styled.p`
  color: ${colors.white};
  font-family: 'Oswald', sans-serif;
  font-size: 28px;
  font-weight: 300;
  margin: 1em auto;
  max-width: 770px;
  text-align: center;
  text-transform: uppercase;
  > span {
    background: ${colors.green};
    padding: 0 4px;
  }
`;

const ItWorkSection = styled(Container)`
  margin-top: 50px;
  @media (max-width: 728px) {
  }

  @media (max-width: 480px) {
    padding: 0 10px;
  }
`;

const ItWorkContainer = styled.div`
  align-content: center;
  align-items: flex-start;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin: 80px 0 0;
  width: 100%;
  &.reverse {
    flex-direction: row-reverse;
    @media (max-width: 500px) {
      margin-left: 10px;
    }

    @media (max-width: 480px) {
      margin-left: 0;
    }
  }
  &.center {
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 480px) {
    display: block;
    text-align: center;
  }
`;

const ItWorkImage = styled.img`
  align-self: flex-start;

  @media (max-width: 500px) {
    width: 40%;
    margin-right: 20px;
  }

  @media (max-width: 480px) {
    width: 60%;
  }

`;

const ItWorkInfos = styled.div`
  max-width: 380px;
  @media (max-width: 480px) {
    max-width: 100%;
  }
`;

const ItWorktTitle = styled.h4`
  color: ${colors.white};
  font-family: 'Oswald', sans-serif;
  font-size: 28px;
  font-weight: bold;
  margin: 0;
  text-align: left;
  text-transform: uppercase;

  @media (max-width: 480px) {
    text-align: center;
  }
`;

const ItWorkDescription = styled.p`
  color: ${colors.battleshipFrey};
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  line-height: 1.56;
  text-align: left;

  @media (max-width: 480px) {
    text-align: center;
  }
`;

const SaveSection = styled.section`
  background: ${colors.darkSkyBlue2};
  margin-top: 130px;
  min-height: 200px;
  position: relative;
  width: 100%;
  z-index: 0;
  &:before {
    content: "";
    position: absolute;
    top: -46px;
    right: 0;
    width: 100%;
    height: 83px;
    background: ${colors.darkSkyBlue2};
    border-left: 0;
    border-right: 1366px solid transparent;
    border-top: 30px solid ${colors.darkSkyBlue2};
    transform: rotate(-2.2deg);
  }
  &:after {
    content: "";
    position: absolute;
    bottom: -30px;
    right: 0;
    width: 100%;
    height: 50px;
    background: ${colors.darkSkyBlue2};
    border-left: 0;
    border-right: 50px solid transparent;
    border-top: 79px solid ${colors.darkSkyBlue2};
    transform: rotate(-2.2deg);
  }
`;

const SaveContainer = styled(Container)`
  text-align: center;
  position: relative;
  width: 100%;
  z-index: 9;
`;

const SaveTitle = styled.h3`
  color: ${colors.white};
  font-family: 'Oswald', sans-serif;
  font-size: 72px;
  font-weight: bold;
  letter-spacing: 11.2px;
  margin: 0 0 -6px;
  text-align: center;
  text-transform: uppercase;
`;

const SaveSubtitle = styled.p`
  background: ${colors.darkBlue};
  color: ${colors.white};
  display: inline-block;
  font-family: 'Oswald', sans-serif;
  font-size: 28px;
  font-weight: 300;
  line-height: 1.21;
  margin-top: -14px;
  padding: 10px 20px;
  text-align: center;
  text-transform: uppercase;
`;

const SaveInfo = styled.span`
  color: ${colors.white};
  display: inline-block;
  font-family: 'Roboto', sans-serif;
  font-size: 18px;
  font-sttyle: italic;
  margin-top: 0px;
  text-align: center;
`;

export class Index extends React.Component {
  static async getInitialProps(ctx) {
    const items = await ctx.api.get('/saves/active?limit=3');
    const saves = savesMapper(items.data);
    return { saves };
  }

  constructor(props) {
    super(props);

    const showLoggedOutToast = props.url.query.loggedOut;

    this.state = {
      logged: props.isSignedIn,
      loginModalIsOpen: false,
      modalVideoIsOpen: false,
      activeTab: 1,
      saves: props.saves,
      subscribeTo: undefined,
      showToast: false,
      showLoggedOut: showLoggedOutToast,
      subscriptionConfirmationModalIsOpen: false,
      currentSubscribeTarget: null,
      forgotPasswordModalIsOpen: false
    };

    this.openLoginModal = this.openLoginModal.bind(this);
    this.openVideoModal = this.openVideoModal.bind(this);
    this.closeLoginModal = this.closeLoginModal.bind(this);
    this.handleChangeIndex = this.handleChangeIndex.bind(this);
    this.loadSaves = this.loadSaves.bind(this);
    this.handleSubscribe = this.handleSubscribe.bind(this);
    this.handleSubscribeConfirm = this.handleSubscribeConfirm.bind(this);
    this.handleSubscribeCancel = this.handleSubscribeCancel.bind(this);
    this.removeLogoutMessage = this.removeLogoutMessage.bind(this);
    this.goToOffers = this.goToOffers.bind(this);
    this.openForgotPasswordModal = this.openForgotPasswordModal.bind(this);
    this.closeForgotPasswordModal = this.closeForgotPasswordModal.bind(this);
  }

  componentDidMount() {
    if (this.props.isSignedIn) {
      this.loadSaves();
      this.loadSubscriptions();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isSignedIn) {
      this.loadSaves();
      this.closeLoginModal();

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

    if (!this.props.url.query.loggedOut) {
      this.setState({ showLoggedOut: nextProps.url.query.loggedOut });
    }
  }

  removeLogoutMessage() {
    this.setState({ showLoggedOut: false });
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
        const item = this.state.saves.rows.find(
          save => save.id === subscribeTo
        );
        item.hasSubscribed = true;

        const subscriptionsRows = [...this.state.subscriptions.rows, item];

        this.setState({
          subscriptions: {
            count: subscriptionsRows.length,
            rows: subscriptionsRows
          },
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

  openLoginModal(subscribeTo) {
    this.setState({
      loginModalIsOpen: true,
      currentSubscribeTarget: subscribeTo
    });
  }

  openVideoModal() {
    this.setState({ modalVideoIsOpen: true });
  }

  closeLoginModal() {
    this.setState({ loginModalIsOpen: false, modalVideoIsOpen: false });
  }

  openForgotPasswordModal() {
    this.setState({ forgotPasswordModalIsOpen: true, loginModalIsOpen: false });
  }

  closeForgotPasswordModal() {
    this.setState({ forgotPasswordModalIsOpen: false });
  }

  handleChangeIndex(tabIndex) {
    this.setState({ activeTab: tabIndex });
  }

  goToOffers(slug) {
    Router.push(`/offer?saveId=${slug}`, `/offer/${slug}`);
  }

  loadSaves() {
    return this.props.api
      .get('/saves/active?limit=3')
      .then(res => res.data)
      .then(saves => savesMapper(saves))
      .then((saves) => {
        this.setState({
          saves
        });
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

  render() {
    return (
      <Page hasFooter>

        <Banner>
          <Toolbar
            logged={this.props.isSignedIn}
            background="transparent"
            onLogout={this.props.onLogout}
            api={this.props.api}
          />

          <BannerContainer>
            <Title>Juntos pelo melhor</Title>
            <Subtitle>
              Conectamos consumidores, unimos demanda e negociamos diretamente com os melhores fabricantes com máxima segurança e condições exclusivas. Sem intermediários!
              <br/>
              <br/>
              #VEMPROCLUBE
              <br/>
              <br/>
            </Subtitle>

            <BannerActions>
              <RenderIf expr={!this.props.isSignedIn}>
                <Button outline onClick={this.openLoginModal}>
                  participe agora mesmo
                </Button>
              </RenderIf>
              <VideoButton onClick={this.openVideoModal}>
                entenda como funciona
              </VideoButton>
            </BannerActions>

          </BannerContainer>

        </Banner>

        <BrandContainer>
          <BannerTitle>
            compre direto na fonte
          </BannerTitle>
          <BannerSubTitle>
            A união de consumidores através de uma plataforma inteligente possibilita a compra direta da fabrica.
          </BannerSubTitle>
          <BannerSubTitle>
            CONFIANÇA <Bullet/> CONFORTO <Bullet/> CUSTO BENEFÍCIO
          </BannerSubTitle>
          <BrandImagesContainer>
            <BrandImage
              src="/static/images/image-costumers.svg"
              alt="Cliente"
            />
            <BrandImage src="/static/images/image-shop.svg" alt="loja" />
            <BrandImage
              src="/static/images/image-factory.svg"
              alt="Fabricante"
            />
          </BrandImagesContainer>
          <BannerSubTitleHash>
            #VEMPROCLUBE
          </BannerSubTitleHash>
        </BrandContainer>

        <WeAreNotContainer>
          <WeAreNot>
            <WeAreNotSubtitle>nãããão somos</WeAreNotSubtitle>
            <WeAreNotTitle>compra coletiva</WeAreNotTitle>
          </WeAreNot>

          <WeAreNotDescription>
            Entenda
            {' '}
            <span>como funciona</span>
            {' '}
            o passo a passo da negociação de cada Save até o momento da compra
          </WeAreNotDescription>
        </WeAreNotContainer>

        <ItWorkSection>
          <ItWorkContainer>
            <ItWorkImage
              src="/static/images/img-how-it-works-1.svg"
              alt="Passo 1 - Interesse"
            />
            <ItWorkInfos>
              <ItWorktTitle>interesse</ItWorktTitle>
              <ItWorkDescription>
                Você, assim como centenas de outras pessoas, aplica a um save, demonstrando seu interesse em um determinado produto (o tempo máximo que um save fica aberto para entrada de consumidores é de 5 dias).
              </ItWorkDescription>
            </ItWorkInfos>
          </ItWorkContainer>

          <ItWorkContainer className="reverse">
            <ItWorkImage
              src="/static/images/img-how-it-works-2.svg"
              alt="Passo 2 - Concorrência entre fabricantes"
            />
            <ItWorkInfos>
              <ItWorktTitle>Concorrência entre fabricantes</ItWorktTitle>
              <ItWorkDescription>
                Fechado o save (ninguém mais entra), o sistema libera uma única ordem para que os mais conceituados fabricantes daquele produto(já cadastrados no 99saves.com) enviem sua melhor oferta para atender aquela quantidade de pessoas (como se fossemos um grande varejista).
              </ItWorkDescription>
            </ItWorkInfos>
          </ItWorkContainer>

          <ItWorkContainer>
            <ItWorkImage
              src="/static/images/img-how-it-works-3.svg"
              alt="Passo 3 - Você dá sua opinião"
            />
            <ItWorkInfos>
              <ItWorktTitle>Você dá sua opinião</ItWorktTitle>
              <ItWorkDescription>
                A equipe de compras do 99saves.com analisa os melhores fornecedores e ofertas, seleciona as melhores (até 3) e disponibiliza para votação. A votação não é obrigatória e encerra-se automaticamente após 24 horas da sua abertura (cada participante tem direito a um voto).
              </ItWorkDescription>
            </ItWorkInfos>
          </ItWorkContainer>

          <ItWorkContainer className="reverse">
            <ItWorkImage
              src="/static/images/img-how-it-works-4.svg"
              alt="Passo 4 - A oferta vencedora fica disponível para compra"
            />
            <ItWorkInfos>
              <ItWorktTitle>
                A oferta vencedora fica disponível para compra
              </ItWorktTitle>
              <ItWorkDescription>
                Encerrada a pesquisa, automaticamente a oferta que teve o maior número de votos é liberada para compra através de um link em sua área do usuário, dentro do 99saves.com.
                {' '}
              </ItWorkDescription>
            </ItWorkInfos>
          </ItWorkContainer>

          <ItWorkContainer>
            <ItWorkImage
              src="/static/images/img-how-it-works-5.svg"
              alt="Passo 5 - A venda e a entrega será feita diretamente pelo fabricante"
            />
            <ItWorkInfos>
              <ItWorktTitle>
                A venda e a entrega será feita diretamente pelo fabricante
              </ItWorktTitle>
              <ItWorkDescription>
                Você acessa o link de compra em sua área do usuário no 99saves.com, é redirecionado para a compra dentro do site do fabricante pelo preço exclusivo que negociamos e ele realizará a entrega(nós estaremos de olho neste processo, apoiando no que for preciso). Lembre-se, você terá 48 horas para finalizar a compra ou seu link será inativado.
              </ItWorkDescription>
            </ItWorkInfos>
          </ItWorkContainer>

          <ItWorkContainer className="reverse">
            <ItWorkImage
              src="/static/images/img-how-it-works-6.svg"
              alt="Passo 6 - Você avalia a sua compra"
            />
            <ItWorkInfos>
              <ItWorktTitle>Você avalia a sua compra</ItWorktTitle>
              <ItWorkDescription>
                O 99saves.com só trabalha com os melhores. É por isso que você avaliará a sua satisfação com o fabricante, a entrega e o seu produto. Fabricantes que tiverem menos de 75% de satisfação dos usuários, serão automaticamente descadastrados da plataforma. Juntos, somos mais fortes, certo?
              </ItWorkDescription>
            </ItWorkInfos>
          </ItWorkContainer>

          <ItWorkContainer className="center">
            <RenderIf expr={!this.props.isSignedIn}>
              <Button outline onClick={this.openLoginModal}>
                participe agora mesmo
              </Button>
            </RenderIf>
          </ItWorkContainer>

        </ItWorkSection>

        <SaveSection>
          <SaveContainer>
            <SaveTitle>Saves</SaveTitle>
            <SaveSubtitle>
              Escolha o produto que te interessa e participe do save
            </SaveSubtitle>
            <SaveInfo>
              Lembre-se: aplique somente para aqueles que tiver real interesse de compra
            </SaveInfo>
          </SaveContainer>
        </SaveSection>

        <CardsList>
          {this.state.saves.rows &&
            this.state.saves.rows.map(save => (
              <StyledCard
                {...save}
                key={save.id}
                logged={this.props.isSignedIn}
                openLoginModal={() => this.openLoginModal(save.id)}
                handleSubscribe={() => this.handleSubscribe(save.id)}
                goToOffers={() => this.goToOffers(save.slug)}
                linkToBuy={save.winnerProduct && save.winnerProduct.link_buy}
              />
            ))}
        </CardsList>

        <ItWorkContainer className="center">
          <Button outline href="/saves">veja todos os saves</Button>
        </ItWorkContainer>

        <Footer marginTop />

        <LoginModal
          isOpen={this.state.loginModalIsOpen}
          onForgotPassword={this.openForgotPasswordModal}
          onClose={this.closeLoginModal}
        />

        <ForgotPasswordModal
          isOpen={this.state.forgotPasswordModalIsOpen}
          onClose={this.closeForgotPasswordModal}
          api={this.props.api}
        />

        <SubscriptionConfirmationModal
          isOpen={this.state.subscriptionConfirmationModalIsOpen}
          subscribeTo={this.state.currentSubscribeTarget}
          onConfirm={this.handleSubscribeConfirm}
          onClose={this.handleSubscribeCancel}
        />

        <FeedbackModal
          ref={instance => { this.feedbackmodal = instance; }}
          title="Estamos apenas começando..."
          subtitle="Estes são apenas os primeiros saves cadastrados em nossa plataforma, aos poucos também teremos novos tipos de produtos. <br/><br/> Fique de olho!"/>

        <Modal
          isOpen={this.state.modalVideoIsOpen}
          onClose={this.closeLoginModal}
          onRequestClose={this.closeLoginModal}
          contentLabel="Video promocional"
          style={modalVideoStyles}
        >
          <ModalVideoContent>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/LhmMrQAMqnA?rel=0&amp;showinfo=0&amp;autoplay=1"
            />
          </ModalVideoContent>
        </Modal>

        <Toast show={this.state.showToast}>
          Você receberá um email com atualizações sobre esta negociação.
        </Toast>
        <Toast
          show={this.state.showLoggedOut}
          onFade={this.removeLogoutMessage}
        >
          Você foi deslogado com sucesso.
        </Toast>
      </Page>
    );
  }
}

export default withApi()(Index);
