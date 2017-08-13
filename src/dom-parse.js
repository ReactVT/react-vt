const assert = require('./assert.js');
const nodeStore = require('./nodeStore.js');

// This is not being used now, but we are assigning it a value that we'd want to have access
// to in the future if we are making Enzyme boilerplate
let appName;

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

const parser = (dom, reactDom) => {
  if (dom.constructor.name === 'Connect') return ReduxParentTraverse(dom, reactDom);
  return ReactParentTraverse(dom);
};


// THIS NEEDS TO BE CLEANED UP!
const nodeStoreController = (node, name, address, props, state, parent = false) => {
  nodeStore.storage.address[address] = {};
  nodeStore.storage.address[address].state = state;
  nodeStore.storage.address[address].props = props;
  nodeStore.storage.address[address].name = name; 

  if (props.id && node.constructor.name === 'ReactDOMComponent') nodeStore.storage.id[props.id] = address; 
  if (props.className && node.constructor.name === 'ReactDOMComponent') {
    if (nodeStore.storage.class[props.className]) nodeStore.storage.class[props.className].push(address)
    else nodeStore.storage.class[props.className] = [address];
  }
  if (node.constructor.name === 'ReactDOMComponent') {
    nodeStore.storage.tag[name] ? nodeStore.storage.tag[name].push(address) : nodeStore.storage.tag[name] = [address];
    nodeStore.storage.address[address].index = nodeStore.storage.tag[name].length - 1;  
  } else {
    nodeStore.storage.node[name] ? nodeStore.storage.node[name].push(address) : nodeStore.storage.node[name] = [address];
    nodeStore.storage.address[address].index = nodeStore.storage.node[name].length - 1;  
    if (!parent && node._renderedComponent._hostNode.id) nodeStore.storage.id[node._renderedComponent._hostNode.id] = address;
    if (!parent && node._renderedComponent._hostNode.className) {
      const classArr = node._renderedComponent._hostNode.className.split(/\s+/);
      classArr.forEach(item => {
        if (nodeStore.storage.class[item]) nodeStore.storage.class[item].push(address)
        else nodeStore.storage.class[item] = [address];
      })
    }
  }

}

const ReactParentTraverse = (dom) => {
  nodeStore.empty();
  // This grabs the name of the top component, will be needed for when we generate enzyme test files.. 
  appName = dom.constructor.name;

  // Create a new data object to fill with our parsed DOM. 
  const data = {};

  // target parent state
  // add conditional for whether or not parent component is smart otherwise throw error
  data.name = dom.constructor.name;
  data.component = true;
  data.props = dom.props; 
  data.state = dom.state;
  data.address = data.props.id ? [data.props.id] : [dom._reactInternalInstance._hostContainerInfo._node.id, 0];

  // Add necessary data to nodeStore
  nodeStoreController(dom, data.name, data.address, data.props, data.state, true);

  data.children = [];

  // Setting debugId of parent node to -1. Not sure if React ever uses 0. 

  data.debugId = -1; 


  // make call to another function where it will traverse through children
  const children = dom._reactInternalInstance._renderedComponent._renderedChildren; 
  if (children) {
    Object.values(children).forEach((child, index) => {
      const address = data.address.slice(0); 
      address.push(index);
      if (child.constructor.name !== 'ReactDOMTextComponent') data.children.push(ReactChildTraverse(child, address));
    });
  }

  assert.checkAssert();
  return data;
};

const ReactChildTraverse = (child, address) => {
  const childData = {
    children: [],
  };
  let children;
  var props;
  childData.debugId = child._debugID; 
  // set conditional for component vs not
  if (child.constructor.name === 'ReactCompositeComponentWrapper') {
    // Parsing logic for smart React Components
    childData.name = child._currentElement.type.name;
    childData.component = true;
    childData.state = cloneDeep(child._instance.state);
    let newProps = child._instance.props !== null ? Object.assign({}, child._instance.props) : null; 
    if (newProps.children) delete newProps.children; 
    childData.props = cloneDeep(newProps);
    children = child._renderedComponent._renderedChildren;
    childData.address = child._renderedComponent._hostNode.id ? [child._renderedComponent._hostNode.id] : address; 
  } else {
    // Parsing logic for dumb React Components
    childData.name = child._currentElement.type;
    childData.component = false;
    childData.state = null;
    childData.address = child._currentElement.props.id ? [child._currentElement.props.id] : address; 
    var newProps = child._currentElement.props !== null ? Object.assign({}, child._currentElement.props) : null; 
    if (newProps.children) delete newProps.children; 
    childData.props = cloneDeep(newProps);
    children = child._renderedChildren;
  }

  // Store the props and state of the object on a nodeStore so that we can easily reference these for assertions
  // let addressString = childData.address.toString();
  // nodeStore.storage.address[addressString] = {};
  // nodeStore.storage.address[addressString].state = childData.state;
  // nodeStore.storage.address[addressString].props = childData.props; 
  nodeStoreController(child, childData.name, childData.address, childData.props, childData.state);

  // filter out text nodes from children
  if (children) {
      let textNodes = 0; 
      Object.values(children).forEach((child, index) => {
        // Filter out all React Text Nodes
        // We may want to add the text data to the parent node on a future revision
        if (child.constructor.name === 'ReactDOMTextComponent') {
          textNodes++; 
        } else { 
          // create new Address to pass on to children in recursive call
          let newAddress = childData.address.slice(0);
          newAddress.push(index - textNodes);
          childData.children.push(ReactChildTraverse(child, newAddress));
        }
      });
  }
  return childData;
};


/////////////// REDUX LOGIC //////////////////


// const ReduxParentTraverse = (dom, reactDom) => {

//   //nodeStore = {}; 

//   // This grabs the name of the top component, will be needed for when we generate enzyme test files. 
//   appName = dom.constructor.name;

//   // Create a new data object to fill with our parsed DOM. 
//   const data = {};

//   // target parent state
//   // add conditional for whether or not parent component is smart otherwise throw error

//   // THIS WAS CHANGED
//   data.name = dom._reactInternalInstance._renderedComponent._instance.constructor.name;
//   if (data.name === 'Constructor') data.name = 'Component';  
//   data.component = true;
//   data.props = null; 
//   // THIS WAS CHANGED
//   data.state = Object.keys(dom.state).length > Object.keys(dom.store.getState()).length ? dom.state : dom.store.getState();
//   data.address = [reactDom.findDOMNode(dom).parentNode.getAttribute("id"), 0];
//   let stringAddress = data.address.toString(); 
//   nodeStore[stringAddress] = {};
//   nodeStore[stringAddress].state = data.state;
//   nodeStore[stringAddress].props = {}; 
//   data.children = [];

//   // Setting debugId of parent node to -1. Not sure if React ever uses 0. 

//   data.debugId = -1; 


//   // make call to another function where it will traverse through children

//   // I THINK THIS WAS CHANGED
//   const children = dom._reactInternalInstance._renderedComponent._renderedComponent._renderedChildren; 
//   Object.values(children).forEach((child, index) => {
//     const address = data.address.slice(0); 
//     address.push(index);
//     if (child.constructor.name !== 'ReactDOMTextComponent') data.children.push(ReduxChildTraverse(child, address));
//   });
//   assert.checkAssert(); 
//   return data;
// };

// const ReduxChildTraverse = (child, address) => {
//   const childData = {
//     children: [],
//   };
//   let children;
//   var props;
//   childData.debugId = child._debugID; 

//   console.log('find the props', child);
//   // set conditional for component vs not
//   if (child.constructor.name === 'ReactCompositeComponentWrapper') {
//     // Parsing logic for smart React Components
//     childData.name = child._currentElement.type.name;

//     childData.component = true;

//     // THIS WAS CHANGED
//     let newProps = Object.assign({}, child._instance.props);
//     if (newProps.children) delete newProps.children; 
//     childData.props = cloneDeep(newProps);
//     childData.state = cloneDeep(child._instance.state);
//     children = child._renderedComponent._renderedChildren;
//     childData.address = child._instance.props.id ? [child._instance.props.id] : address; 
//   } else {
//     // Parsing logic for dumb React Components
//     childData.name = child._currentElement.type;
//     childData.component = false;
//     childData.state = null;
//     childData.address = child._currentElement.props.id ? [child._currentElement.props.id] : address; 
//     var newProps = Object.assign({}, child._currentElement.props); 
//     if (newProps.children) delete newProps.children; 

//     // childData.props = cloneDeep(newProps);

//     childData.props = cloneDeep(newProps); 
//     children = child._renderedChildren;
//   }

//   // Hack solution in case we can't figure out something better
//   if (childData.name === 'Constructor') childData.name = 'Component';  

//   // Store the props and state of the object on a nodeStore so that we can easily reference these for assertions
//   let addressString = childData.address.toString();
//   nodeStore[addressString] = {};
//   nodeStore[addressString].state = childData.state;
//   nodeStore[addressString].props = childData.props; 

//   // filter out text nodes from children
//   if (children) {
//       let textNodes = 0; 
//       Object.values(children).forEach((child, index) => {
//         // Filter out all React Text Nodes
//         // We may want to add the text data to the parent node on a future revision
//         if (child.constructor.name === 'ReactDOMTextComponent') {
//           textNodes++; 
//         } else { 
//           // create new Address to pass on to children in recursive call
//           let newAddress = childData.address.slice(0);
//           newAddress.push(index - textNodes);
//           childData.children.push(ReduxChildTraverse(child, newAddress));
//         }
//       });
//   }
//   return childData;
// };












module.exports = {
  parser
}