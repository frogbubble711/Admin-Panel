import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import { createStructuredSelector } from 'reselect';
import { Helmet } from 'react-helmet';
import injectReducer from 'utils/injectReducer';
import injectSaga from 'utils/injectSaga';
import AuthModule from 'routes/auth';
import AppModule from 'routes/app';
import reducer from 'routes/auth/redux/reducers';
import saga from 'routes/auth/redux/saga';
import { makeSelectCurrentUser, makeSelectPersistLoaded } from './redux/selectors';

class App extends Component {
  renderApp = () => {
    const { currentUser } = this.props;
    return currentUser ? <AppModule /> : <AuthModule />;
  }

  render() {
    const { persistLoaded } = this.props;
    if (!persistLoaded) {
      return null;
    }

    return (
      <div className="app">
        <Helmet
          titleTemplate="%s - Admin Panel"
          defaultTitle="Admin Panel"
        >
          <meta name="description" content="Admin Panel Application" />
        </Helmet>

        <Switch>
          <Route path="/" render={this.renderApp} />
        </Switch>
      </div>
    );
  }
}

const mapStateToProps = createStructuredSelector({
  currentUser: makeSelectCurrentUser(),
  persistLoaded: makeSelectPersistLoaded(),
});

const withReducer = injectReducer({ key: 'auth', reducer });
const withSaga = injectSaga({ key: 'auth', saga });
const withConnect = connect(mapStateToProps);

export default withRouter(compose(
  withReducer,
  withSaga,
  withConnect
)(App));
