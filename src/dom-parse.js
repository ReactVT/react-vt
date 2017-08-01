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

let iterableId = 0;

const parentTraverse = (dom) => {
  console.log('DOM', dom);
  const data = {
    attributes: {},
  };
  // target parent state
  // add conditional for whether or not parent component is smart otherwise throw error
  data.name = dom.constructor.name;
  data.attributes.component = true;
  data.attributes.state = dom.state;
  data.children = [];
  
  // assign property as a flag for spy
  // TODO - add conditional to not add spyID if it already exists
  dom._instance = { _spyID: iterableId };
  iterableId += 1;

  // make call to another function where it will traverse through children
  const children = dom._reactInternalInstance._renderedComponent._renderedChildren;
  Object.values(children).forEach((child) => {
    data.children.push(traverse(child));
  });
  return data;
};

const traverse = (child) => {
  const childData = {
    attributes: {},
    children: [],
  };
  let children;
  var props; 
  // set conditional for component vs not
  if (child.constructor.name === 'ReactCompositeComponentWrapper') {
    childData.name = child._currentElement.type.name;
    console.log('this is child', child)
    child._instance._spyID = iterableId;
    iterableId += 1;

    childData.attributes.component = true;
    childData.attributes.state = cloneDeep(child._instance.state);
    childData.attributes.props = cloneDeep(child._instance.props);
    children = child._renderedComponent._renderedChildren;
  } else {
    childData.name = child._currentElement.type;
    childData.attributes.component = false;
    childData.attributes.state = null;
    // To revise later
    childData.attributes.props = null;
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