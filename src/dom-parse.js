const sinon = require('sinon'); 
const testSpy = sinon.spy();

let appName;
let tempFlag = false;
let fakeAssert = []; 
fakeAssert.push({'type': 'action', 'loc': ['board', 0, 0], 'event': 'click'});
fakeAssert.push({'type': 'test', 'loc': ['board', 0, 0], 'dataType': 'prop', 'key': 'letter', 'value': 'X'})  

console.log('new stuff');

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
  console.log('real dom', dom);
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

module.exports = parentTraverse;