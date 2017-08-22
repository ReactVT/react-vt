const domParse = require('./dom-parse.js');
const nodeStore = require('./nodeStore.js');

const assert = require('./assert.js');
let topNode;
let firstPass = true;  

// importing React from example app
function injector(React, parentNode) {
  topNode = parentNode;
  startTraverse(parentNode);
  const func = React.Component.prototype.setState;
  React.Component.prototype.setState = function(...args) {
    // set timeout to delay traverse so that it is appended to original setState
    startTraverse(this);
    return func.apply(this, args);
  }
  // listens for messages from backgroundjs -> content script -> webpage
  window.addEventListener('message', function(event) {
    // only accept messges to self
    if (event.source != window) return;
    // filter out other messages floating around in existing context

    if (event.data.type === 'assertion') {
      if (event.data.flag === 'onload') {
        event.data.message.forEach(item => {
          assert.addAssert(item); 
        });
        startTraverse(parentNode);
      } else if (event.data.flag === 'delete') {
        assert.deleteBlock(event.data.message);
      } else {
        assert.addAssert(event.data.message);
      }
    }
  }, false);
}

function startTraverse(self, reactDom) {
  const nodePackage = {}; 
  setTimeout(()=> {
      let travPromise = throttle(domParse.parser, 25);
      travPromise.then((result) => {
        // Conditional to display feedback for react router incompatibility
        if (result === 'react-router') {
          window.postMessage({ type: 'virtualdom', data: 'react-router' }, "*");
        } else {
          nodePackage.virtualDom = result;
          nodePackage.nodeStore = nodeStore.storage;
          let title = document.title;
          // specify message type to target specific message
          window.postMessage({ type: 'virtualdom', data: nodePackage, topNode: topNode.constructor.name, title: title, first: firstPass}, "*");
          firstPass = false;
        }
      });
  }, 0);
}

function throttle(func, wait) {
  let waiting = false; 
  return new Promise((resolve, reject) => {
    if (waiting) reject(); 
    waiting = true; 
    setTimeout(() => {
      waiting = false;
      let result = func(topNode);
      resolve(result);
    }, wait);
   return func(topNode);
  }); 
}

module.exports = injector;
