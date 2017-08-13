

var assertionList = [
{name: 'test1', asserts: [{'selector': 'component', 'selectorName': 'Row', 'selectorModifier': '.length', 'source': '', 'property': '', 'modifier': '', 'type': 'equal', 'value': '2', 'dataType': 'number', 'loc': ''}]},
{name: 'test2', asserts: [{'selector': 'component', 'selectorName': 'Row', 'selectorModifier': '[1]', 'source': 'props', 'property': 'number', 'modifier': '', 'type': 'equal', 'value': '6', 'dataType': 'number', 'loc': ''}]}, 
{name: 'test3', asserts: [{'selector': 'component', 'selectorName': 'Row', 'selectorModifier': '[1]', 'source': 'props', 'property': 'funarr', 'modifier': '[2]', 'type': 'equal', 'value': '3', 'dataType': 'number', 'loc': ''}]}, 
{name: 'test4', asserts: [{'selector': 'component', 'selectorName': 'Row', 'selectorModifier': '[1]', 'source': 'props', 'property': 'funarr', 'modifier': '.length', 'type': 'equal', 'value': '5', 'dataType': 'number', 'loc': ''}]}, 
{name: 'test5', asserts: [{'selector': 'component', 'selectorName': 'App', 'selectorModifier': '', 'source': 'state', 'property': 'test', 'modifier': '', 'type': 'equal', 'value': 'testy', 'dataType': 'string', 'loc': ''}]}, 
{name: 'test6', asserts: [{'selector': 'class', 'selectorName': 'imaclass', 'selectorModifier': '.length', 'source': '', 'property': '', 'modifier': '', 'type': 'equal', 'value': '2', 'dataType': 'number', 'loc': ''}]},
{name: 'test7', asserts: [{'selector': 'node', 'selectorName': '', 'selectorModifier': '', 'source': 'text', 'property': '', 'modifier': '', 'type': 'equal', 'value': 'one', 'dataType': 'string', 'loc': ["list", 0]}, 
{'type': 'action', 'event': 'click', 'loc': ["list", 0, 0]},
{'selector': 'node', 'selectorName': '', 'selectorModifier': '', 'source': 'text', 'property': '', 'modifier': '', 'type': 'equal', 'value': 'two', 'dataType': 'string', 'loc': ["list", 0]}]}];

var assertionList2 = [
{name: 'Test one', asserts: [{'selector': 'id', 'selectorName': 'shopList', 'selectorModifier': '', 'source': 'text', 'property': '', 'modifier': '', 'type': 'equal', 'value': 'Shopping List', 'dataType': 'string', 'loc': ''}]}, 

{name: 'Test two', asserts: [{'selector': 'tag', 'selectorName': 'h1', 'selectorModifier': '[0]', 'source': 'text', 'property': '', 'modifier': '', 'type': 'equal', 'value': 'Shopping List', 'dataType': 'string', 'loc': ''}]}]; 

var assertionList3 = [
{name: 'Test three', asserts: [{'selector': 'node', 'selectorName': 'node', 'selectorModifier': '', 'source': 'props', 'property': 'test', 'modifier': '', 'type': 'equal', 'value': 'Shopping List', 'dataType': 'string', 'loc': [root,0,4,0]}]}]; 

var one = ['root', 0, 4, 0].toString(); 
var two = ['list', 0].toString(); 
var nodeStore = {address: {}}; 
nodeStore.address[one] = {}; 
nodeStore.address[one].name = 'h3'; 
nodeStore.address[one].index = 1;
nodeStore.address[two] = {}; 
nodeStore.address[two].name = 'h3'; 
nodeStore.address[two].index = 1;

const newLine = "\n";
const doubleLine = "\n \n";
const oneSpace = '  '; 
const twoSpace = '    ';

function generateTest(list, app) { 
  if (list.length === 0) return; 
  let result = addDependencies();  
  result = startDescribe(result, app); 
  list.forEach(item => {
    result += addBlock(item); 
  }); 
  result += '});'
  console.log(result);
}

function addDependencies() {
  let dependents = `const expect = require('chai').expect;${newLine}`;
  dependents += `import { mount } from 'enzyme';${newLine}`;
  dependents += `import App from 'fill this in with proper path';${doubleLine}`;
  return dependents; 
}

function startDescribe(code, app) {
  let result = code; 
  result += `describe('React VT Tests', () => {${newLine}`; 
  result += `${oneSpace}let wrapper;${newLine}`; 
  result += `${oneSpace}beforeEach(() => {${newLine}`; 
  result += `${twoSpace}wrapper = mount<${app} />);${newLine}`; 
  result += `${oneSpace}});${doubleLine}`; 
  return result;   
}

function addBlock(block) {
  let result = `${oneSpace}it('${block.name}', () => {${newLine}`;
  block.asserts.forEach(assert => {
    if (assert.type === 'action') result += addAction(assert);
    else result += addTest(assert); 
  }); 
  return result;  
} 

function nodeTest(assert) { 
  console.log(assert.loc);
  console.log(nodeStore.address)
  let name = nodeStore.address[assert.loc.toString()].name; 
  let index = nodeStore.address[assert.loc.toString()].index; 
  let result = `${oneSpace}expect(wrapper.find('${name}').at(${index}).props().${assert.property}).`;
  result += evalTest(assert); 
  return result;
}

function nodeAddress(assert) {
   
}

function addTest(assert) {
  // Edge cases for now
  if (assert.source === 'state') return stateTest(assert);
  if (assert.selector === 'node') return nodeTest(assert); 
  
  // Logic for doing initial find
  let findMod = '';
  if (assert.selector === 'id') findMod = '#'; 
  if (assert.selector === 'class') findMod = '.';
  let result = `${twoSpace}expect(wrapper.find('${findMod}${assert.selectorName}').`; 
  
  // Selector Mod Logic
  if (assert.selectorModifier === '.length') result += 'length).';
  if (assert.selectorModifier[0] === '[') {
    findMod = assert.selectorModifier.slice(1, -1);
    result += `at(${findMod}).`;
  }

  // Source logic
  if (assert.source) result += sourceTest(assert);
  result += evalTest(assert); 
  return result; 
}

function evalTest(assert) {
  if (assert.type !== 'equal') return 'we have this?'; 
  const expectation = convertType(assert); 
  if (assert.dataType !== 'string') return `to.equal(${expectation});${newLine}`;
  return `to.equal('${expectation}');${newLine}`;
}

function convertType(assert) {
  switch (assert.dataType) {
    case 'boolean':
      return Boolean(assert.value);
      break;
    case 'number':
      return +assert.value;
      break;
    case 'null':
      return null;
      break;
    case 'undefined':
      return undefined;
      break;
    case 'string':
      return assert.value; 
      break;
    default:
      console.log('Data type block failed');
      return 'Data type block failed';
  }
}

function sourceTest(assert) {
  if (assert.source === 'text') return 'text()).';
  let result;
  if (assert.modifier === '.length') {
    return `props().${assert.property}.length).`;
  }
  if (assert.modifier[0] === '[') {
    return `props().${assert.property}${assert.modifier}).`;
  }
  return `props().${assert.property}).`;
}

function stateTest(assert) {
  let result = `${twoSpace}wrapper = mount(<${assert.selectorName} />);${newLine}`; 
  if (assert.modifier === '') result += `${twoSpace}expect(wrapper.state().${assert.property}).`; 
  else result += `${twoSpace}expect(wrapper.state().${assert.property}${assert.modifier}).`;
  result += evalTest(assert); 
  return result;  
}

function addAction(assert) {
  let result = translateLoc(assert.loc);
  result += `simulate(${assert.event});${newLine}`; 
  return result; 
}

function translateLoc(loc) {
  let result = `${twoSpace}wrapper.find('#${loc[0]}').`;
  for (let i = 1; i < loc.length; i++) {
    result += `childAt(${loc[i]}).`; 
  }
  return result; 
}



generateTest(assertionList, 'App'); 
generateTest(assertionList2, 'App'); 
generateTest(assertionList3, 'App');

















// Psuedo Tests
// Component
  // Check length of components
  // Check index of component
    // Check props
     // prop modifier
       // length
       // index
    // State? 

// Tag
  // Check length of tags
  // Check index of tag
    // Simulate event
    // Check inner text

 // Class
   // Check length of classes
   // Check index of class
     // simulate event
     // Check inner text

// Id 
  // Simulate event
  // Check text

// Our node stuff
  // ? // Psuedo Tests
// Component
  // Check length of components
  // Check index of component
    // Check props
     // prop modifier
       // length
       // index
    // State? 

// Tag
  // Check length of tags
  // Check index of tag
    // Simulate event
    // Check inner text

 // Class
   // Check length of classes
   // Check index of class
     // simulate event
     // Check inner text

// Id 
  // Simulate event
  // Check text

// Our node stuff
  // ? 


// describe('Full Mount Test', () => {
//   let wrapper;
//   beforeEach(() => {
//     wrapper = mount(<App />);
//   });

//   it('allows us to check Component length', () => {
//    expect(wrapper.find('Row').length).to.equal(2);
//   });

//   it('allows us to props on a specific component', () => {
//    expect(wrapper.find('Row').at(1).props().number).to.equal(6);
//   });

//   it('allows us to use a modifier on props', () => {
//    expect(wrapper.find('Row').at(1).props().funarr[2]).to.equal(3);
//   });

//   it('allows us to find the length of a prop', () => {
//    expect(wrapper.find('Row').at(1).props().funarr.length).to.equal(5);
//   });
//////////////
//   it('allows us to check state on a component', () => {
//    expect(wrapper.state().test).to.equal('testy');
//   });

//   it('allows us to get the length of a class list', () => {
//    expect(wrapper.find('.imaclass').length).to.equal(2);
//   });

//   it('allows us to get the length of a class list', () => {
//    expect(wrapper.find('.imaclass').length).to.equal(2);
//   });

//   it('allows us to get the length of a class list', () => {
//    expect(wrapper.find('.imaclass').length).to.equal(2);
//   });

//   it('allows us to get the length of a class list', () => {
//    expect(wrapper.find('.imaclass').length).to.equal(2);
//   });

//   it('allows us to simulate an event and read text', () => {
//    expect(wrapper.find('#list').childAt(0).text()).to.equal('one'); 
//    wrapper.find('#list').childAt(0).childAt(0).simulate('click');
//    expect(wrapper.find('#list').childAt(0).text()).to.equal('two'); 
//   });

//   it('allows us to read text on an id', () => {
//    expect(wrapper.find('#shopList').text()).to.equal('Shopping List'); 
//   });
// });