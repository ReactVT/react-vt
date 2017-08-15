const domParse = require('./dom-parse.js');
const nodeStore = require('./nodeStore.js');

const assert = require('./assert.js');
const throttledParse = throttle(domParse.parser, 50);

// importing React from example app
function injector(React, parentNode) {
  startTraverse(parentNode);
  const func = React.Component.prototype.setState;
  React.Component.prototype.setState = function(...args) {
    // set timeout to delay traverse so that it is appended to original setState
    startTraverse(this);
    return func.apply(this, args);
  }
  // listens for messages from backgroundjs -> content script -> webpage
  window.addEventListener('message', function(event) {
    console.log('message', event);
    // only accept messges to self
    if (event.source != window) return;
    // filter out other messages floating around in existing context
    if (event.data.type === 'onLoad') {

    }
    if (event.data.type === 'assertion') {
      console.log("webpage received this from content script", event.data.message);
      assert.addAssert(event.data.message);
    }
  }, false);
}

function startTraverse(self, reactDom) {
  const nodePackage = {}; 
  setTimeout(()=> {
      nodePackage.virtualDom = throttledParse(self, reactDom);
      nodePackage.nodeStore = nodeStore.storage;
      // specify message type to target specific message
      window.postMessage({ type: 'virtualdom', data: nodePackage}, "*");
  }, 0);
}

function throttle(func, wait) {
 let waiting = false; 
 return function throttler(...args) {
   if (waiting) return; 
   waiting = true; 
   setTimeout(() => waiting = false, wait);
   return func(...args);
 }
}

module.exports = injector;
