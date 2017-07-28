const parentTraverse = (dom) => {
  console.log(dom)
  const data = {};
  // target parent state
  // add conditional for whether or not parent component is smart otherwise throw error
  data.name = dom.constructor.name;
  data.component = true;
  data.state = dom.state;
  data.children = [];
  
  // make call to another function where it will traverse through children
  const children = dom._reactInternalInstance._renderedComponent._renderedChildren;
  Object.values(children).forEach((child) => {
    data.children.push(traverse(child));
  });

  console.log(data);
  // send traversed DOM from react app to content script
  setTimeout(()=>window.postMessage({ type: 'sample', data: 'data here'}, "*"), 0);
  
  // listens for message from content script
  window.addEventListener('message', function(event) {
    // only accept messges to self
    if (event.source != window) return;
    // specify message type to target specific message
    // filter out other messages floating around in existing context
    if (event.data.type === 'backgroundmsg') {
      console.log("webpage received this from content script", event);
    }
  }, false);

};

const traverse = (child) => {
  const childData = {
    children: [],
  };
  let children;
  // set conditional for component vs not
  if (child.constructor.name === 'ReactCompositeComponentWrapper') {
    childData.name = child._currentElement.type.name;
    childData.component = true;
    childData.state = child._instance.state;
    childData.props = child._instance.props;
    children = child._renderedComponent._renderedChildren;
  } else {
    childData.name = child._currentElement.type;
    childData.component = false;
    childData.state = null;
    childData.props = child._currentElement.props;
    children = child._renderedChildren;
  }
  if (children) {
      Object.values(children).forEach((child) => {
        childData.children.push(traverse(child));
      });
  }
  return childData;
};

module.exports = parentTraverse;
