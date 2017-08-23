const assert = require('./assert.js');
const nodeStore = require('./nodeStore.js');


// Initial Call, checks to make sure this is not a router application which is not supported yet
const parser = (dom, reactDom) => {
  if (dom._reactInternalInstance._context.router) return 'reactRouter';
  return ReactParentTraverse(dom);
};


// The nodestore collects all relevant information such as ids, classes of the page in an object
const nodeStoreController = (node, name, address, props, state, parent = false) => {
  nodeStore.storage.address[address] = {};
  nodeStore.storage.address[address].state = state;
  nodeStore.storage.address[address].props = props;
  nodeStore.storage.address[address].name = name;
  let classArr;  

  // Here we seperate out logic based on the type of component we are working on
  if (node.constructor.name === 'ReactDOMComponent') {
    // Setting id for item
    if (props.id) nodeStore.storage.id[props.id] = address; 

    // Setting classes for item
    if (props.className) {
      classArr = props.className.split(/\s+/);
      classArr.forEach(newclass => {
        if (nodeStore.storage.class[newclass]) nodeStore.storage.class[newclass].push(address)
        else nodeStore.storage.class[newclass] = [address];
      });
    }
    
    // Storing the tag of the node
    nodeStore.storage.tag[name] ? nodeStore.storage.tag[name].push(address) : nodeStore.storage.tag[name] = [address];
    
    // Storing the index of the item in case we need to reference it out of a group selection. 
    nodeStore.storage.address[address].index = nodeStore.storage.tag[name].length - 1; 

  // This logic will cover smart components
  } else {
 
    // We store props, state, and address about the node here
    if (nodeStore.storage.node[name]) {
      nodeStore.storage.node[name].address.push(address);
      nodeStore.storage.node[name].state.push(state);
      nodeStore.storage.node[name].props.push(props);

    } else {
      nodeStore.storage.node[name] = {};
      nodeStore.storage.node[name].address = [address];
      nodeStore.storage.node[name].state = [state];
      nodeStore.storage.node[name].props = [props];
    }

    // Index of item in case we need to reference it based on a group selection
    nodeStore.storage.address[address].index = nodeStore.storage.node[name].address.length - 1;

    // Some special logic based on whether or not this component is the root component or not
    // This is for non parent nodes
    if (!parent) {
      // Setting node id
      if (node._renderedComponent._hostNode.id) nodeStore.storage.id[node._renderedComponent._hostNode.id] = address;
      // Setting node classes
      if (node._renderedComponent._hostNode.className) {
        classArr = node._renderedComponent._hostNode.className.split(/\s+/);
        classArr.forEach(item => {
          if (nodeStore.storage.class[item]) nodeStore.storage.class[item].push(address)
          else nodeStore.storage.class[item] = [address];
        });
      }
    // Logic for parent component
    } else {
      // Setting node id
      if (node._reactInternalInstance._renderedComponent._hostContainerInfo._node.id) nodeStore.storage.id[node._reactInternalInstance._renderedComponent._hostContainerInfo._node.id] = address;
      // Setting node classes
      if (node._reactInternalInstance._renderedComponent._hostContainerInfo._node.className) {
        classArr = node._reactInternalInstance._renderedComponent._hostContainerInfo._node.className.split(/\s+/);
        classArr.forEach(item => {
          if (nodeStore.storage.class[item]) nodeStore.storage.class[item].push(address)
          else nodeStore.storage.class[item] = [address];
        });
      }
    } 
  }
}

const ReactParentTraverse = (dom) => {
  // Resets the nodeStore for the new traverse
  nodeStore.storage = {
  address: {},
  id: {}, 
  class: {}, 
  node: {}, 
  tag: {} 
  }; 

  // Create a new data object to fill with our parsed DOM. 
  const data = {};

  // Target parent name
  data.name = dom.constructor.name;
  // Parent is automatically a smart component, so this is set to true
  data.component = true;
  // Setting parent props
  data.props = dom.props;
  // Setting parent state 
  data.state = dom.state;
  // Setting parent address
  data.address = [dom._reactInternalInstance._hostContainerInfo._node.id, 0];
  // Setting parent id
  data.id = dom._reactInternalInstance._renderedComponent._hostContainerInfo._node.id; 
  // Setting parent class
  data.class = dom._reactInternalInstance._renderedComponent._hostContainerInfo._node.className; 
  // Add necessary data to nodeStore
  nodeStoreController(dom, data.name, data.address, data.props, data.state, true);
  // Instantiate the children array for the parent node
  data.children = [];

  // Setting debugId of parent node to -1. Not sure if React ever uses 0. 
  data.debugId = -1; 


  // make call to another function where it will traverse through children
  const children = dom._reactInternalInstance._renderedComponent._renderedChildren; 
  if (children) {
    Object.values(children).forEach((child, index) => {
      const address = data.address.slice(0); 
      address.push(index);
      // Here we start our recursion through the virtual DOM
      if (child.constructor.name !== 'ReactDOMTextComponent') data.children.push(ReactChildTraverse(child, address));
    });
  }
  // At this point we've finished all of our recursive calls to ReactChildTraverse
  // So we now check our asserts
  assert.checkAssert();
  // and return the data we collected
  return data;
};

// Our traversal function for every node but the root node
const ReactChildTraverse = (child, address) => {
  // We declare the object we will be building, starting it with an empty children array
  const childData = {
    children: [],
  };
  let children;
  let props;
  childData.debugId = child._debugID; 
  // set conditional for component vs not
  if (child.constructor.name === 'ReactCompositeComponentWrapper') {
    // Parsing logic for smart React Components
    childData.name = child._currentElement.type.name;
    childData.component = true;

    // We clone the state to ensure no circular references
    childData.state = cloneDeep(child._instance.state);

    // If props exist, make a copy of it so we can delete children out of it, otherwise it's null
    let newProps = child._instance.props !== null ? Object.assign({}, child._instance.props) : null;
    // Delete children out of props 
    if (newProps.children) delete newProps.children; 
    // Set our props to a cloned version of the props
    childData.props = cloneDeep(newProps);
    // Get references to the node's children
    children = child._renderedComponent._renderedChildren;
    // Set address, it's either the node's id or the address passed down to the node
    childData.address = child._renderedComponent._hostNode.id ? [child._renderedComponent._hostNode.id] : address;
    // Set node's id 
    childData.id = child._renderedComponent._hostNode.id;
    // Set node's class
    childData.class = child._renderedComponent._hostNode.className; 
  } else {
    // Parsing logic for dumb React Components
    // See above comments if you need to see what is happening here, same logic, different locations
    childData.name = child._currentElement.type;
    childData.component = false;
    childData.state = null;
    childData.address = child._currentElement.props.id ? [child._currentElement.props.id] : address; 
    var newProps = child._currentElement.props !== null ? Object.assign({}, child._currentElement.props) : null; 
    if (newProps.children) delete newProps.children; 
    childData.props = cloneDeep(newProps);
    childData.id = childData.props.id; 
    childData.class = childData.props.className; 
    children = child._renderedChildren;
  }

  // We add the info we've collected for our node to the nodeStore
  nodeStoreController(child, childData.name, childData.address, childData.props, childData.state);

  // If we have children, set up our recursive calls
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
          // Text nodes offset our address algorithm, so we subtract them from our address index to ensure consistency
          newAddress.push(index - textNodes);
          // We populate our children array with the results of further recursive calls to the object's children
          childData.children.push(ReactChildTraverse(child, newAddress));
        }
      });
  }
  // Delete id and className from props as to not have confusion on the frontend
  if (childData.props.id) delete childData.props.id; 
  if (childData.props.className) delete childData.props.className;  
  return childData;
};

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


module.exports = {
  parser
}