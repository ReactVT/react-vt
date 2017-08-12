# React VT
A visual testing tool for React developers.

React-VT presents a live view of the React component structure of your app, along with the current state and props. 

Users can define assertions and test them in real time while interacting with their application.

## Planned release: September 2017

### Set Up
Run npm install in your root project folder

```
npm install --save-dev react-vt
```

Import React VT in your top-level component or index.js and use your imported React class as an argument to React VT
```
import reactVT from 'react-vt';
reactVT(React);
```

Install React-VT Chrome Developer Tool from the Chrome store: 
https://chrome.google.com/webstore/detail/react-vt/aphjepidficfgphkbggojoemgpmianhi?hl=en

Run your application by opening it in the browser.

Open Chrome Developer Tools -> React VT
