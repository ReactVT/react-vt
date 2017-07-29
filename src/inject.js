const parentTraverse = require('./dom-parse.js');
// importing React from example app
function injector(React) {
  let traversedDom;
  const func = React.Component.prototype.setState;
  React.Component.prototype.setState = function(...args) {
    console.log('state hooked');
    // set timeout to delay traverse so that it is appended to original setState
    setTimeout(()=> {
      traversedDom = parentTraverse(this)
      // specify message type to target specific message
      window.postMessage({ type: 'virtualdom', data: traversedDom}, "*");
  }, 0);
    return func.apply(this, args);
  }

  // listens for messages from backgroundjs -> content script -> webpage
  window.addEventListener('message', function(event) {
    // only accept messges to self
    if (event.source != window) return;
    // filter out other messages floating around in existing context
    if (event.data.type === 'backgroundmsg') {
      console.log("webpage received this from content script", event);
    }
  }, false);
}

module.exports = injector;
