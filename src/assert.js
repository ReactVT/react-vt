const domParse = require('./dom-parse.js');
const sinon = require('sinon'); 
const nodeStore = require('./nodeStore.js');

// Current asserts to check. 
let currentAsserts = [];

// Get the actual DOM node at the supplied address and return it
function getNode(address) {
  let result = document.getElementById(address[0]); 
  for (let i = 1; i < address.length; i++) {
    result = result.children[address[i]];
  }
  return result; 
}

// Check our current assertion blocks and run any available assertions. 
// Runs on every state change
function checkAssert() {
  // For debugging purposes, should be removed prior to release
  if (currentAsserts.length === 0) {
    console.log('no asserts to check');
    return; 
  }

  // Loop through all current assertion blocks
  currentAsserts.forEach((currAssert, i) => {

    // Loop through the current assertion block that we are testing 
    // This can probably be refactored/cleaned up 
    while (currAssert.asserts.length > 0) {

      // current becomes the first assertion
      let current = currAssert.asserts[0];
      let valueToTest;
      let result;
  
      // We hit this if we have reached an action that hasn't been set up yet
      // We add a spy on the specified node and then stop checking this assertion block
      if (current.type === 'action' && current.added === false) {
        current.added = true; 
        const spy = sinon.spy();
        getNode(current.loc).addEventListener(current.event, spy);
        current.spy = spy; 
        break; 
      }
  
      // We hit this if our current assert is an action that has not happened yet
      // We stop checking this assertion block
      if (current.type === 'action' && current.spy.calledOnce === false) {
        // Get rid of this prior to release
        console.log('spy sees nothing')
        break; 
      }
  
      // We hit this if our current assert is an action that has happened
      // We remove the assertion from the assertion block and then we go to the next while loop cycle
      if (current.type === 'action' && current.spy.calledOnce === true) {
        console.log('spy passed');
        currAssert.asserts.shift(); 
        continue; 
      }
      
      // Converts value to the designated type
      switch (current.dataType) {
        case 'boolean':
          current.value = Boolean(current.value);
          break;
        case 'number':
          current.value = +current.value;
          break;
        case 'null':
          current.value = null;
          break;
        case 'undefined':
          current.value = undefined;
          break;
        case 'string':
          break;
        default:
          console.log('Data type block failed');
      }

      // Check modifier field for input and determine value to test
      if (current.modifier === '.length') {
        valueToTest = nodeStore.storage.address[current.loc.toString()][current.source][current.property].length;
      } else if (current.modifier[0] === '[') {
        let index = current.modifier.slice(1, -1);
        valueToTest = nodeStore.storage.address[current.loc.toString()][current.source][current.property][index];
      } else {
        valueToTest = nodeStore.storage.address[current.loc.toString()][current.source][current.property];
      }

      // We hit this if the assertion is equal
      // In this case, we make the specified comparison and send the result back to the chrome extension
      if (current.type === 'equal') {
        result = valueToTest === current.value;
      } else if (current.type === 'greaterthan') {
        result = valueToTest > current.value;
      } else if (current.type === 'lessthan') {
        result = valueToTest < current.value;
      }

      // // TODO : exist and notexist condition
      // else if (current.type === 'exist') {
      //   result 
      // } else if (current.type === 'notexist') {
      // }

      let resultmessage = 'result is ' + result;
      sendResult(resultmessage);
      console.log('result is ', result); 
      currAssert.asserts.shift();
    }
    // We hit this if we have removed all of the assertions from our assertion block
    // In that case, we remove the assertion block from our list of current assertion blocks
    if (currAssert.asserts.length === 0) currentAsserts.splice(i,1); 
  });
}

// Send result back to chrome extension
function sendResult(messageObject) {
  window.postMessage({ type: 'test-result', data: messageObject}, "*"); 
}

// Add assert is called from inject.js whenever an assertion message is recieved from the chrome extension
function addAssert(freshAssert) {
  // assertBundle is the eventual assertion block that we will be adding
  let assertBundle = {};
  assertBundle.asserts = [];

  // This is a flag to determine whether we have added an action yet on this assertion block
  // We want to have the ability to see if a specific event happens more than once so we only want to have one spy set up at a time
  let actionAdded = false; 
  
  // Loop through our fresh assert bundle so that we can add it to our current asserts
  freshAssert.data.forEach(curr => {
    // 'actions' require a special logic and need to be reconstructed before inserting
    if (curr.type === 'action') {
        // base info for every action
        let newAssert = {};
        newAssert.loc = curr.loc;
        newAssert.type = 'action';
        newAssert.event = curr.event; 
      // This is how we will handle our first action in the assertion bundle
      // For this one, we will add a spy  
      if (!actionAdded) {
        let spy = sinon.spy();
        getNode(curr.loc).addEventListener(curr.event, spy);
        newAssert.spy = spy; 
        newAssert.added = true;

        // Here we set our flag so that we only add one spy to this bundle at this time
        actionAdded = true;    
      } else {
        // Any actions other than the first will get no spy and have the added property be false
        newAssert.added = false; 
      }

      // Here we add our newly made action assert to the bundle  
    assertBundle.asserts.push(newAssert); 
    } else {
  
      // We just pass in an evaluation assert as is  
      assertBundle.asserts.push(curr);
    }
  });

  // Grab our new bundle and add it our current assert queue
  currentAsserts.push(assertBundle);
}

module.exports = {
  checkAssert,
  addAssert,
}