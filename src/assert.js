const domParse = require('./dom-parse.js');
const sinon = require('sinon'); 
const nodeStore = require('./nodeStore.js');

// Current asserts to check. 
let currentAsserts = [];

function getLocation(assertion) {
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


function actionController(current, blockName) {
  // We hit this if we have reached an action that hasn't been set up yet
  // We add a spy on the specified node and then stop checking this assertion block
  if (current.added === false) {
    current.added = true; 
    const spy = sinon.spy();
    let currNode = getNode(current.loc);
    currNode.addEventListener(current.event, spy);
    if (current.event === 'keypress') {
      current.lastInput = '';
      currNode.addEventListener(current.event, () => current.lastInput = currNode.value);
    }
    current.spy = spy; 
    return false; 
  }
  
  // We hit this if our current assert is an action that has not happened yet
  // We stop checking this assertion block
  const enterEvent = (current.event === 'keypress' && current.spy.called && current.spy.args[current.spy.args.length - 1][0].key === 'Enter' && current.lastInput === current.inputValue); 
  if (current.event === 'keypress' && !enterEvent) return false; 
  // We hit this if our current assert is an action that has happened
  // We remove the assertion from the assertion block and then we go to the next while loop cycle
  if (enterEvent || current.spy.called === true) {
    const resultMessage = {
      // TODO: this property might need to change to get assertion block name from chrome extension message
      assertionBlock: blockName,
      assertID: current.assertID,
      result: true,
      comparator: current.type,
    };
    sendResult(resultMessage);
    return true;
  }
  return false;
}

function modifierController(modifier, data) {
  if (modifier === '.length') {
    return data.length;
  } else if (modifier[0] === '[') {
    let index = modifier.slice(1, -1);
    return data[index];
  }
}

// Check our current assertion blocks and run any available assertions. 
// Runs on every state change

// TAKE OUT CURRENT ASSERTS FROM ARGUMENT ONCE DONE WITH DUMMY DATA
function checkAssert() {
  // For debugging purposes, should be removed prior to release
  if (currentAsserts.length === 0) {
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
        if (actionController(current, currAssert.name)) {
          currAssert.asserts.shift();
          continue;
        }
        break;
      }
      
      // Compose result message to be sent to chrome extension
      const resultMessage = {
        // TODO: this property might need to change to get assertion block name from chrome extension message
        assertionBlock: currAssert.name,
        assertID: current.assertID,
      };
      // current becomes the first assertion
      let result;
      let dataToTest;
      if (current.selector === 'node') dataToTest = nodeTest(current);
      if (current.selector === 'component') dataToTest = componentTest(current);
      if (current.selector === 'id') dataToTest = idTest(current);
      if (current.selector === 'class') dataToTest = classTest(current);
      if (current.selector === 'tag') dataToTest = tagTest(current);
            
      // Convert our value to the specified variable type
      current.value = convertType(current);

      // We hit this if the assertion is equal
      // In this case, we make the specified comparison and send the result back to the chrome extension
      result = convertResult(current.type, dataToTest, current.value); 


      // Assign test result details to resultMessage
      resultMessage.expected = current.value;
      resultMessage.actual = dataToTest;
      resultMessage.comparator = current.type;
      resultMessage.result = result;
      sendResult(resultMessage);
      currAssert.asserts.shift();
    }
    // We hit this if we have removed all of the assertions from our assertion block
    // In that case, we remove the assertion block from our list of current assertion blocks
    if (currAssert.asserts.length === 0) currentAsserts.splice(i,1); 
  });
}

 // Collects data to evaluate for tag tests. 
function tagTest(current) {
  if (current.selectorModifier === '.length') return nodeStore.storage.tag[current.selectorName].length;
  let index = current.selectorModifier.slice(1, -1);
  let address = nodeStore.storage.tag[current.selectorName][index]; 
  let dataToTest = getNode(address); 
  return dataToTest.innerText; 
}

 // Collects data to evaluate for class tests. 
function classTest(current) {
  if (current.selectorModifier === '.length') return nodeStore.storage.class[current.selectorName].length;
  let index = current.selectorModifier.slice(1, -1);
  let address = nodeStore.storage.class[current.selectorName][index]; 
  let dataToTest = getNode(address); 
  return dataToTest.innerText; 
}

 // Collects data to evaluate for id tests. 
function idTest(current) {
  return document.getElementById(current.selectorName).innerText; 
}

 // Collects data to evaluate for component tests. 
function componentTest(current) {
  if (current.selectorModifier === '.length') return nodeStore.storage.node[current.selectorName].address.length;
  let index = current.selectorModifier.slice(1, -1);
  let address = nodeStore.storage.node[current.selectorName].address[index].toString(); 
  let dataToTest = nodeStore.storage.address[address]; 
  if (current.source === 'state') dataToTest = dataToTest.state[current.property];
  if (current.source === 'props') dataToTest = dataToTest.props[current.property];
  if (current.modifier) dataToTest = modifierController(current.modifier, dataToTest); 
  return dataToTest; 
}

 // Collects data to evaluate for node tests. 
function nodeTest(current) {
  let dataToTest = getLocation(current);

  // Check selector modifier field for input and determine value to test
  if (current.selectorModifier) dataToTest = modifierController(current.selectorModifier, dataToTest);
  //if (current.source === 'text') dataToTest = dataToTest.innerText;
  if (current.source === 'state') dataToTest = dataToTest.state[current.property];
  if (current.source === 'props') dataToTest = dataToTest.props[current.property];
  if (current.modifier) dataToTest = modifierController(current.modifier, dataToTest); 
  return dataToTest; 
}

 // Returns evaluation result based on the type of test being run
function convertResult(type, dataToTest, value) {
  if (type === 'equal') {
    return dataToTest === value;
  } else if (type === 'greaterthan') {
    return dataToTest > value;
  } else if (type === 'lessthan') {
    return dataToTest < value;
  } else if (type === 'notequal') {
    return dataToTest !== value;
  }
}

 // Converts data to the specific type mentioned in the test
function convertType(current) {
  switch (current.dataType) {
    case 'boolean':
      return Boolean(current.value);
    case 'number':
      return +current.value;
    case 'null':
      return null;
    case 'undefined':
      return undefined;
    case 'string':
      return current.value;
    default:
      return 'Data type block failed';
  }
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
        newAssert.assertID = curr.assertID; 
        newAssert.loc = curr.loc;
        newAssert.type = 'action';
        newAssert.event = curr.event;
        newAssert.inputValue = curr.inputValue; 

      // This is how we will handle our first action in the assertion bundle
      // For this one, we will add a spy  
      if (!actionAdded) {
        let spy = sinon.spy();
        let currNode = getNode(curr.loc)
        currNode.addEventListener(curr.event, spy);
        newAssert.spy = spy; 
        newAssert.added = true;

        // Here we set our flag so that we only add one spy to this bundle at this time
        actionAdded = true;
        if (curr.event === 'keypress') {
            newAssert.lastInput = '';
           currNode.addEventListener(curr.event, () => newAssert.lastInput = currNode.value);
        }
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
  checkAssert();
}

// Deletes an assertion block based on the name given
function deleteBlock(name) {
  for (let i = 0; i < currentAsserts.length; i++) {
    if (currentAsserts[i].name === name) {
      currentAsserts.splice(i, 1);
      break; 
    }
  }
}

module.exports = {
  checkAssert,
  addAssert,
  deleteBlock,
}