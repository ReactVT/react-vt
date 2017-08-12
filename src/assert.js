const domParse = require('./dom-parse.js');
const sinon = require('sinon'); 
const nodeStore = require('./nodeStore.js');

// Current asserts to check. 
let currentAsserts = [];

function getLocation(assertion) {
  console.log('in assertion', assertion); 
  if (assertion.selector === 'node') return nodeStore.storage.address[assertion.loc.toString()];
  if (assertion.selector === 'id') return document.getElementById(assertion.selectorName);
  if (assertion.selector === 'class') return document.getElementsByClassName(assertion.selectorName);
  if (assertion.selector === 'tag') return document.getElementsByTagName(assertion.selector);
  if (assertion.selector === 'component') return nodeStore.storage.node[assertion.selectorName];
}

// Get the actual DOM node at the supplied address and return it
function getNode(address) {
  let result = document.getElementById(address[0]); 
  for (let i = 1; i < address.length; i++) {
    result = result.children[address[i]];
  }
  return result; 
}


function actionController(current) {
  // We hit this if we have reached an action that hasn't been set up yet
  // We add a spy on the specified node and then stop checking this assertion block
  if (current.added === false) {
    current.added = true; 
    const spy = sinon.spy();
    getNode(current.loc).addEventListener(current.event, spy);
    current.spy = spy; 
    return false; 
  }

  // We hit this if our current assert is an action that has not happened yet
  // We stop checking this assertion block
  if (current.spy.calledOnce === false) return false;

  // We hit this if our current assert is an action that has happened
  // We remove the assertion from the assertion block and then we go to the next while loop cycle
  if (current.spy.calledOnce === true) {
    const resultMessage = {
      // TODO: this property might need to change to get assertion block name from chrome extension message
      assertionBlock: 'currentAsserts.name placeholder',
      assertID: 'current.assertID placeholder',
      result: true,
      comparator: current.type,
    };
    sendResult(resultMessage);
    console.log('result message to be sent back', resultMessage);
    return true;
  }

}

function modifierController(modifier, data) {
  if (modifier === '.length') {
    return data.length;
  } else if (current.selectorModifier[0] === '[') {
    let index = current.selectorModifier.slice(1, -1);
    return data[index];
  }
}

// Check our current assertion blocks and run any available assertions. 
// Runs on every state change

// TAKE OUT CURRENT ASSERTS FROM ARGUMENT ONCE DONE WITH DUMMY DATA
function checkAssert() {
  console.log('in check assert', currentAsserts)
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
      let current = currAssert.asserts[0];
      // if action
      if (current.type === 'action') {
        if (actionController(current)) {
          currAssert.asserts.shift();
          continue;
        }
        break;
      }

      // Compose result message to be sent to chrome extension
      const resultMessage = {
        // TODO: this property might need to change to get assertion block name from chrome extension message
        assertionBlock: 'currentAsserts.name placeholder',
        assertID: 'current.assertID placeholder',
      };
      // current becomes the first assertion
      let result;
      let dataToTest = getLocation(current);
      console.log('data to test', dataToTest);
      
      // Check selector modifier field for input and determine value to test
      if (current.selectorModifier) dataToTest = modifierController(current.selectorModifier, dataToTest);
      if (current.source === 'text') dataToTest = dataToTest.innerText;
      if (current.source === 'state') dataToTest = dataToTest.state[current.property];
      if (current.source === 'props') dataToTest = dataToTest.props[current.property];

      if (current.modifier) dataToTest = modifierController(current.modifier, dataToTest); 
            
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

      // We hit this if the assertion is equal
      // In this case, we make the specified comparison and send the result back to the chrome extension
      if (current.type === 'equal') {
        result = dataToTest === current.value;
      } else if (current.type === 'greaterthan') {
        result = dataToTest > current.value;
      } else if (current.type === 'lessthan') {
        result = dataToTest < current.value;
      }
      // // TODO : exist and notexist condition
      // else if (current.type === 'exist') {
      //   result 
      // } else if (current.type === 'notexist') {
      // }

      // Assign test result details to resultMessage
      resultMessage.expected = current.value;
      resultMessage.actual = dataToTest;
      resultMessage.comparator = current.type;
      resultMessage.result = result;

      console.log('result is ', result); 
      console.log('result message to be sent back', resultMessage);
      sendResult(resultMessage);
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
  assertBundle.name = freshAssert.name; 

  // This is a flag to determine whether we have added an action yet on this assertion block
  // We want to have the ability to see if a specific event happens more than once so we only want to have one spy set up at a time
  let actionAdded = false; 
  
  // Loop through our fresh assert bundle so that we can add it to our current asserts
  freshAssert.asserts.forEach(curr => {
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