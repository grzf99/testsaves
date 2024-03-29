import React, { Component } from 'react';
import Router from 'next/router';
import withStore from 'next-redux-wrapper';
import getCookies from 'next-cookies';
import RenderIf from '../common/render-if';
import createStore from '../../store';
import { noop } from '../../utils';
import createAPIClient from '../../utils/apiClient';
import { TOKEN_COOKIE_KEY, logout } from '../../store/auth';
import { setUser } from '../../store/currentUser';

export default function withAuth(
  { isAdminPage = false } = {},
  mapStateToProps = noop,
  mapDispatchToProps
) {
  return (Page) => {
    class Authenticated extends Component {
      static getInitialProps(ctx) {
        let user;
        let token;
        if (ctx.req !== undefined) {
          user = getCookies(ctx)[TOKEN_COOKIE_KEY];
          if (user) {
            ctx.store.dispatch(setUser(JSON.parse(user)));
            token = JSON.parse(user).token
          }
        }
        const api = createAPIClient(token);

        return (
          Page.getInitialProps &&
          Page.getInitialProps(Object.assign({}, ctx, { api }))
        );
      }

      constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
      }

      componentWillMount() {
        if (typeof window !== 'undefined') {
          let url;
          if (!this.props.isSignedIn) {
            url = isAdminPage ? '/admin/login' : '/login';
          } else if (isAdminPage && !this.props.isAdmin) {
            url = '/admin/login';
          }

          if (url) {
            Router.replace(
              `${url}?as=${Router.router.asPath}&pathname=${Router.router.pathname}&query=${JSON.stringify(Router.router.query)}`
            );
          }
        }

        this.client = createAPIClient(this.props.token);
      }

      handleLogout() {
        const url = isAdminPage ? '/admin/login' : '/';
        this.props.logout();
        Router.push(url);
      }

      render() {
        const { isSignedIn, isAdmin } = this.props;
        const shouldRender = isAdminPage ? isSignedIn && isAdmin : isSignedIn;
        return (
          <RenderIf expr={shouldRender}>
            <Page
              {...this.props}
              api={this.client}
              onLogout={this.handleLogout}
            />
          </RenderIf>
        );
      }
    }

    return withStore(
      createStore,
      state => ({
        token: state.currentUser.token,
        isSignedIn: state.currentUser.token !== undefined,
        isAdmin: state.currentUser.admin,
        ...mapStateToProps(state)
      }),
      { logout, ...mapDispatchToProps }
    )(Authenticated);
  };
}
