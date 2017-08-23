# React VT
A data-driven visual testing tool for React developers. 

React-VT presents a live view of the React component structure of your app, along with current state and props. 

Users can define assertions and test them in real time while interacting with their application. Once the user is satisfied with their defined tests, they can export their assertions into an Enzyme file. 

We built this tool to lower the latency between prototyping and testing your React application.


### Set Up
1. Run npm install for React VT in your root project folder

```
npm install --save-dev react-vt
```

2. Import React VT in your top-level component and use your imported React class and 'this' as arguments to React VT in the componentWillMount lifecycle.
```javascript
import React, { Component } from 'react';
// Add import statement
import reactVT from 'react-vt';

class App extends Component {
  // Add your own componentWillMount if there is not an existing one
  componentWillMount() {
    // Add this line in componentWillMount
    reactVT(React, this);
  }
}
```

3. Install the React VT Chrome Developer Tool from the Chrome store: 
https://chrome.google.com/webstore/detail/react-vt/aphjepidficfgphkbggojoemgpmianhi?hl=en

4. Run your React application in Chrome

5. Open Chrome Developer Tools -> React VT panel

### Usage

## Terminology 
* Assertion Block: An assertion block is a collection of actions and tests to define your assertion. This is analogous to *it* statements in Mocha tests. At least one test or action is required for an assertion block to be valid.
* Action: Actions can be added to your assertion block to build your test case. Click, double click, right click, and enter are available as actions. Enzyme exports are currently unsupported for Enter actions.
* Test: Basic equal, not equal, greater than and less than comparisons can be done on props, state, and text nodes. 

## Creating an assertion block
1. Click on new assertion block and enter a name - e.g. 'should render a button'. This will be the statement that will appear on an exported Enzyme test: 
```javascript
it('should render a button', () => {....});
```
2. To create an action, click on a tree node in order to specify the component that the action will be done on and select an action type.
3. To create a test:
  i. Select target
    * Node: Selected tree node, which refers to a component
    * Component: Specify a component o test the number of components (length) or a particular component (index)
    * ID: Select an element by ID to test text content
    * Class: Select elements by class to test the number of elements that match the className (length) or a particular element of the class (index)
    * Tag: Select a tag type to select elements that are not categorized as class or ID
  ii. Select source: state, props, or both will show up as selections if they exist. Only text is available as a source with ID, class, and tag targets.  
    * Property: Select a property within the state or props
    * Modifier: If the property value is an array, a modifier is available to select either the length or an index to select an element from the array
   iii. Set Expectation
    * Select the data type for the expectation to compare to - string, number, boolean, undefined, and null are available
    * Select a comparator - equal, not equal, greater than, and less than are available
    * Set the expected value
    
## Other Notes
 1. Multiple actions and tests can be defined in one assertion block. Once you're ready to test, save the assertion block. Saved assertion blocks are stored in LocalStorage and are restored the next time React VT is opened.
 2. To run through your actions and tests, execute them in your React application while React VT Developer Tool is open to view live test results.
 3. Once you're satisfied with your tests, you can export them as an Enzyme file and use it as a basis to start writing your own Enzyme tests.

