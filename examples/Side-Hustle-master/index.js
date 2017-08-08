import React from 'react';
import { render } from 'react-dom';
import App from './components/App';
import mapController from './controller/mapController'
import { BrowserRouter as Router,  Route, Link } from 'react-router-dom'
import injector from './../../src/inject.js';
injector(React);

class Hello extends React.Component {
  render(){return <div>Hello</div>}
}

class Bye extends React.Component {
  render(){return <div>Bye</div>}
}

render(
  // <router><App /></router>,
    <Router>
      <div>
      {/*<App />*/}
      <Route path="/" component={App} />
      {/*<Route path="/hello" component={Hello} />
      <Route path="/bye" component={Bye} />*/}
      </div>
    </Router>,
  document.getElementById('root')
);

module.exports = {
  mapController: mapController
};


