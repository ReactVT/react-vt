# React VT
A data-driven visual testing tool for React developers.

React-VT presents a live view of the React component structure of your app, along with current state and props. 

Users can define assertions and test them in real time while interacting with their application. Once the user is satisfied with their defined tests, they can export their assertions into an Enzyme file. 


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
* Assertion Block: An assertion block is a collection of actions and tests to define your assertion. This is analogous to *it* statements in Mocha tests.
* Action: Actions can be added to your assertion block to build your test case. Click, double click, right click, and enter are available as actions. Enzyme exports are currently unsupported for Enter actions.
* Test: Basic equal, not equal, greater than and less than comparisons can be done on props, state, and text nodes. 

## Creating an assertion block
1. 
Click on a tree node in order to specify the component that the action will be done on.  

