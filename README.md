# React VT
A data-driven visual testing tool for React developers.

React-VT presents a live view of the React component structure of your app, along with current state and props. 

Users can define assertions and test them in real time while interacting with their application. Once the user is satisfied with their defined tests, they can export their assertions into an Enzyme file. 


### Set Up
Run npm install for React VT in your root project folder

```
npm install --save-dev react-vt
```

Import React VT in your top-level component and use your imported React class and 'this' as arguments to React VT in the componentWillMount lifecycle.
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

Install the React VT Chrome Developer Tool from the Chrome store: 
https://chrome.google.com/webstore/detail/react-vt/aphjepidficfgphkbggojoemgpmianhi?hl=en

Run your application by opening it in Chrome.

Open Chrome Developer Tools -> React VT
