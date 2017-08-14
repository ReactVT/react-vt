
//////////////////////// 
// DUMMY DATA - REMOVE
///////////////////////
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
{name: 'Test three', asserts: [{'selector': 'node', 'selectorName': 'node', 'selectorModifier': '', 'source': 'props', 'property': 'test', 'modifier': '', 'type': 'equal', 'value': 'Shopping List', 'dataType': 'string', 'loc': ['root',0,4,0]}]}]; 

var one = ['root', 0, 4, 0].toString(); 
var two = ['list', 0].toString(); 
var nodeStore = {address: {}}; 
nodeStore.address[one] = {}; 
nodeStore.address[one].name = 'h3'; 
nodeStore.address[one].index = 1;
nodeStore.address[two] = {}; 
nodeStore.address[two].name = 'h3'; 
nodeStore.address[two].index = 1;
//////////////////////// 
// DUMMY DATA - REMOVE
///////////////////////



// Helper variables for spacing
const newLine = "\n";
const doubleLine = "\n \n";
const oneSpace = '  '; 
const twoSpace = '    ';

// Initial function call, eventually contains the final result of our test creatinon
function generateTest(list, app) {
  // If there are no asserts, return. 
  // This should never happen if our frontend works correctly.  
  if (list.length === 0) return; 

  // With valid input, we can start building our result. 
  // First, we start by adding all dependencies
  let result = addDependencies();
  // Then we add our Describe syntax to begin our test  
  result += startDescribe(app);
  // Now we loop through and add each assertion block as an it statement 
  list.forEach(item => {
    result += addBlock(item); 
  }); 
  // After looping we close our describe function and are finished
  result += '});'
  console.log(result);
}

// Adds any needed dependencies to the top of the file
// TODO - Add mocha? 
function addDependencies() {
  let dependents = `const expect = require('chai').expect;${newLine}`;
  dependents += `import { mount } from 'enzyme';${newLine}`;
  dependents += `import App from 'fill this in with proper path';${doubleLine}`;
  return dependents; 
}

// Starts our test file with an initial describe function that will contain all assertion blocks
function startDescribe(app) {
  let result = `describe('React VT Tests', () => {${newLine}`; 
  result += `${oneSpace}let wrapper;${newLine}`; 
  result += `${oneSpace}beforeEach(() => {${newLine}`; 
  result += `${twoSpace}wrapper = mount<${app} />);${newLine}`; 
  result += `${oneSpace}});${doubleLine}`; 
  return result;   
}

// Builds out an assertion block into an 'it' function
function addBlock(block) {
  let result = `${oneSpace}it('${block.name}', () => {${newLine}`;
  block.asserts.forEach(assert => {
    if (assert.type === 'action') result += addAction(assert);
    else result += addTest(assert); 
  }); 
  return result;  
} 

// Custom logic for tests on node addresses, returns full expect line
function nodeTest(assert) { 
  let name = nodeStore.address[assert.loc.toString()].name; 
  let index = nodeStore.address[assert.loc.toString()].index; 
  let result = `${oneSpace}expect(wrapper.find('${name}').at(${index}).props().${assert.property}).`;
  result += evalTest(assert); 
  return result;
}

// Builds an expect test
function addTest(assert) {
  
  // State source and node selector logic requires special handling
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

// Once we determine what we are evaulating, eval test builds out the logic for what it's being tested against
function evalTest(assert) {
  if (assert.type !== 'equal') return 'we have this?'; 
  const expectation = convertType(assert); 
  if (assert.dataType !== 'string') return `to.equal(${expectation});${newLine}`;
  return `to.equal('${expectation}');${newLine}`;
}

// Converts our expected value into the proper data type, everything starts as a string
function convertType(assert) {
  switch (assert.dataType) {
    case 'boolean':
      return Boolean(assert.value);
    case 'number':
      return +assert.value;
    case 'null':
      return null;
    case 'undefined':
      return undefined;
    case 'string':
      return assert.value; 
    default:
      return 'Data type block failed';
  }
}

// Handles out building source aspect of our expect test
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

// Special handling for state tests
function stateTest(assert) {
  let result = `${twoSpace}wrapper = mount(<${assert.selectorName} />);${newLine}`; 
  if (assert.modifier === '') result += `${twoSpace}expect(wrapper.state().${assert.property}).`; 
  else result += `${twoSpace}expect(wrapper.state().${assert.property}${assert.modifier}).`;
  result += evalTest(assert); 
  return result;  
}

// How we add actions
// TODO - special handling for on-enter? 
function addAction(assert) {
  let result = translateLoc(assert.loc);
  result += `simulate(${assert.event});${newLine}`; 
  return result; 
}

// How we convert our address system to enzyme syntax
function translateLoc(loc) {
  let result = `${twoSpace}wrapper.find('#${loc[0]}').`;
  for (let i = 1; i < loc.length; i++) {
    result += `childAt(${loc[i]}).`; 
  }
  return result; 
}


//// Tests - remove later!!!
generateTest(assertionList, 'App'); 
generateTest(assertionList2, 'App'); 
generateTest(assertionList3, 'App');
