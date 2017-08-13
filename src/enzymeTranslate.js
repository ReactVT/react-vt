

var assertionList = [
{name: 'test1', asserts: [{'selector': 'component', 'selectorName': 'Row', 'selectorModifier': '.length', 'source': '', 'property': '', 'modifier': '', 'type': 'equal', 'value': '2', 'dataType': 'number', 'loc': ''}]},
{name: 'test2', asserts: [{'selector': 'component', 'selectorName': 'Row', 'selectorModifier': '[1]', 'source': 'props', 'property': 'number', 'modifier': '', 'type': 'equal', 'value': '6', 'dataType': 'number', 'loc': ''}]}, 
{name: 'test3', asserts: [{'selector': 'component', 'selectorName': 'Row', 'selectorModifier': '[1]', 'source': 'props', 'property': 'funarr', 'modifier': '[2]', 'type': 'equal', 'value': '3', 'dataType': 'number', 'loc': ''}]}, 
{name: 'test4', asserts: [{'selector': 'component', 'selectorName': 'Row', 'selectorModifier': '[1]', 'source': 'props', 'property': 'funarr', 'modifier': '.length', 'type': 'equal', 'value': '5', 'dataType': 'number', 'loc': ''}]}, 
{name: 'test5', asserts: [{'selector': 'component', 'selectorName': 'App', 'selectorModifier': '', 'source': 'state', 'property': 'test', 'modifier': '', 'type': 'equal', 'value': 'testy', 'dataType': 'string', 'loc': ''}]}, 
{name: 'test6', asserts: [{'selector': 'class', 'selectorName': 'imaclass', 'selectorModifier': '.length', 'source': '', 'property': '', 'modifier': '', 'type': 'equal', 'value': '2', 'dataType': 'number', 'loc': ''}]},


{name: 'test7', asserts: [{'selector': 'node', 'selectorName': '', 'selectorModifier': '', 'source': 'text', 'property': '', 'modifier': '', 'type': 'equal', 'value': 'one', 'dataType': 'text', 'loc': ["list", 0]}, 
{'type': 'action', 'event': 'click', 'loc': ["list", 0]},
{'selector': 'node', 'selectorName': '', 'selectorModifier': '', 'source': 'text', 'property': '', 'modifier': '', 'type': 'equal', 'value': 'two', 'dataType': 'text', 'loc': ["list", 0]}]}]; 

let newLine = "\n";
let oneSpace = '  '; 
let twoSpace = '    ';

function generateTest(list, app) { 
  if (list.length === 0) return; 
  let result = addDependencies();  
  result = startDescribe(result, app); 
  list.forEach(item => {
    result += addBlock(item); 
  }); 
  console.log(result);
}

function addDependencies() {
  let dependents = "const expect = require('chai').expect;" + newLine;
  dependents += "import { mount } from 'enzyme';"  + newLine;
  dependents += "import App from 'fill this in with proper path';" + newLine + newLine;
  return dependents; 
}

function startDescribe(code, app) {
  code += "describe('React VT Tests', () => {" + newLine; 
  code += oneSpace + "let wrapper;" + newLine; 
  code += oneSpace + "beforeEach(() => {"  + newLine; 
  code += twoSpace + "wrapper = mount<" + app + " />);" + newLine; 
  code += oneSpace + "});" + newLine + newLine; 
  return code;   
}

function addBlock(block) {
  let result = "it('" + block.name + "', () => {" + newLine;
  block.asserts.forEach(assert => {
    if (assert.type === 'action') result += addAction(assert); 
  }); 
  return result;  
} 

function add




generateTest(assertionList, 'App'); 


















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