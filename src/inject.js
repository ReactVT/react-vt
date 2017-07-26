const parentTraverse = (dom) => {
  const data = {};
  // target parent state
  // add conditional for whether or not parent component is smart otherwise throw error

  data.smart = true;
  data.state = dom.state;
  data.children = [];
  
  // make call to another function where it will traverse through children
  const children = dom._reactInternalInstance._renderedComponent._renderedChildren;
  Object.values(children).forEach((child) => {
    data.children.push(traverse(child));
  });
  console.log(data);
};

const traverse = (child) => {
  const childData = {
    children: [],
  };
  let children;
  // set conditional for smart component vs not
  if (child.constructor.name === 'ReactCompositeComponentWrapper') {
    childData.smart = true;
    childData.state = child._instance.state;
    childData.props = child._instance.props;
    children = child._renderedComponent._renderedChildren;
  } else {
    childData.smart = false;
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
