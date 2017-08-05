// ./src/index.js
import 'babel-polyfill';
import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { Router, browserHistory } from 'react-router';
import routes from './routes';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

import configureStore from './store/configureStore';

const store = configureStore();

const func = React.Component.prototype.setState; 
React.Component.prototype.setState = function(...args) {
  console.log('setState');
  return func.apply(this, args);
}


render(
  <Provider store={store}>
    <Router routes={routes} history={browserHistory} />
  </Provider>,
  document.getElementById('app')
);