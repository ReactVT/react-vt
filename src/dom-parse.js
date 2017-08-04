const sinon = require('sinon'); 

// This is not being used now, but we have are assigning it a value that we'd want to have access
// to in the future if we are making Enzyme boilerplate
let appName;

// this is only to make our fake dummy add only go once, remove asap
let assertStore = [];  

// Current asserts to check. 
let currentAsserts = [];

// This stores props and state for each node. Uses the address of the node as the key. 
let nodeStore; 

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
    while (currAssert.length > 0) {

      // current becomes the first assertion
      let current = currAssert[0];
  
      // We hit this if we have reached an action that hasn't been set up yet
      // We add a spy on the specified node and then stop checking this assertion block
      if (current.type === 'action' && current.added === false) {
        current.added = true; 
        const spy = sinon.spy();
        getNode(current.loc).addEventListener("click", spy);
        current.spy = spy; 
        break; 
      }
  
      // We hit this if our current assert is an action that has not happened yet
      // We stop checking this assertion block
      if (current.type === 'action' && current.spy.calledOnce === false) {
        console.log('spy sees nothing')
        break; 
      }
  
      // We hit this if our current assert is an action that has happened
      // We remove the assertion from the assertion block and then we go to the next while loop cycle
      if (current.type === 'action' && current.spy.calledOnce === true) {
        console.log('spy passed');
        currAssert.shift(); 
        continue; 
      }
  
      // We hit this if the assertion is equal
      // In this case, we make the specified comparison and send the result back to the chrome extension
      if (current.type === 'equal') {
        let result = nodeStore[current.loc.toString()][current.dataType][current.property]  === current.value; 
        console.log('result is ', result); 
        currAssert.shift();
      }
    }

    // We hit this if we have removed all of the assertions from our assertion block
    // In that case, we remove the assertion block from our list of current assertion blocks
    if (currAssert.length === 0) currentAsserts.splice(i,1); 
  });
}


// Add assert is called from inject.js whenever an assertion message is recieved from the chrome extension
function addAssert(freshAssert) {
  // assertBundle is the eventual assertion block that we will be adding
  let assertBundle = [];

  // This is a flag to determine whether we have added an action yet on this assertion block
  // We want to have the ability to see if a specific event happens more than once so we only want to have one spy set up at a time
  let actionAdded = false; 
  
  // Loop through our fresh assert so that we can add it
  while (freshAssert.length > 0) {
    let newAssert = {};
    let curr = freshAssert[0]; 
    newAssert.loc = curr.loc;
    if (curr.type === 'action') {
        newAssert.type = 'action';
      if (!actionAdded) {
        let spy = sinon.spy();
        getNode(curr.loc).addEventListener("click", spy);
        newAssert.spy = spy; 
        newAssert.added = true;
        actionAdded = true;    
      } else {
        newAssert.added = false; 
      }
    assertBundle.push(newAssert);
    freshAssert.shift();  
    } else {
      assertBundle.push(freshAssert.shift());
    }
  }
  currentAsserts.push(assertBundle);
}

// Creates a clone of an object/array and also clones any objects/arrays that may be nested inside of it
function cloneDeep(value) {
  if (!(value instanceof Object)) return value; 
  const result = new value.constructor; 
  if (value.constructor === Array) {
    value.forEach(item => result.push(cloneDeep(item)));
  } else if (typeof value === 'function') {
    return 'function'; 
  } else {
    for (let key in value) {
    result[key] = cloneDeep(value[key]);
    }
  }
    return result;
}

const parentTraverse = (dom) => {
  nodeStore = {}; 
  // This grabs the name of the top component, will be needed for when we generate enzyme test files. 
  appName = dom.constructor.name;

  // Create a new data object to fill with our parsed DOM. 
  const data = {};

  // target parent state
  // add conditional for whether or not parent component is smart otherwise throw error
  data.name = dom.constructor.name;
  data.component = true;
  data.state = dom.state;
  data.address = [dom._reactInternalInstance._hostContainerInfo._node.id, 0];
  let stringAddress = data.address.toString(); 
  nodeStore[stringAddress] = {};
  nodeStore[stringAddress].state = data.state;
  nodeStore[stringAddress].props = {}; 
  data.children = [];

  // Setting debugId of parent node to -1. Not sure if React ever uses 0. 

  data.debugId = -1; 


  // make call to another function where it will traverse through children
  const children = dom._reactInternalInstance._renderedComponent._renderedChildren;
  Object.values(children).forEach((child, index) => {
    const address = data.address.slice(0); 
    address.push(index);
    if (child.constructor.name !== 'ReactDOMTextComponent') data.children.push(traverse(child, address));
  });
  checkAssert(); 
  return data;
};

const traverse = (child, address) => {

  const childData = {
    children: [],
  };
  let children;
  var props;
  childData.debugId = child._debugID; 
  // set conditional for component vs not
  if (child.constructor.name === 'ReactCompositeComponentWrapper') {
    childData.name = child._currentElement.type.name;
    childData.component = true;
    childData.state = cloneDeep(child._instance.state);
    childData.props = cloneDeep(child._instance.props);
    children = child._renderedComponent._renderedChildren;
    childData.address = child._instance.props.id ? [child._instance.props.id] : address; 
  } else {
    childData.name = child._currentElement.type;
    childData.component = false;
    childData.state = null;
    childData.address = child._currentElement.props.id ? [child._currentElement.props.id] : address; 
    // To revise later
    childData.props = null;
    children = child._renderedChildren;
  }
  let addressString = childData.address.toString();

  nodeStore[addressString] = {};
  nodeStore[addressString].state = childData.state;
  nodeStore[addressString].props = childData.props; 

  // filter out text nodes from children
  if (children) {
      Object.values(children).forEach((child, index) => {

        let newAddress = childData.address.slice(0);
        newAddress.push(index);
        // Filter out all React Text Nodes
        // We may want to add the text data to the parent node on a future revision
        if (child.constructor.name !== 'ReactDOMTextComponent') childData.children.push(traverse(child, newAddress));
      });
  }
  return childData;
};

module.exports = {
  parentTraverse, 
  addAssert
}