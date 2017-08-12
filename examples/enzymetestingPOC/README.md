# Testing

## About
In this unit we'll be practicing writing tests for an existing codebase, and then adding new features and tests for those features. The codebase you'll be working with is a React Tic Tac Toe game hooked up to an extremely simplified database implementation. This code base has a very lacking test suite. Pretend you're a new developer on this project and have been asked to add some features. Without tests in place, you might be a bit hesitant to make significant changes to the code because you're living in fear of **silently breaking an existing feature**. We will work to quash this fear by implementing some tests so that this code can be iterated upon with ease and confidence.

The learning goals for this unit are as follows:
- Gain familiarity with different testing tools such as Mocha, expect, Chai, Supertest, and more
- Practice writing unit tests and integration tests
- Learn two different ways of testing client-side code: Headless browsers and React shallow rendering
- Gain an appreciation for why writing tests is **important**
- Learn to identify when a function is testable or not, and learn to correct that problem

### Testing Framework
The testing framework we will be working with today is [Mocha](https://mochajs.org/). With mocha, we run our tests by using the [mocha CLI tool](https://mochajs.org/#usage) to run the tests we define. Mocha adds some global functions to the JavaScript environment which help with control flow and readability when defining tests, such as `before`, `after`, `describe`, `it`, `beforeEach`, and `afterEach`. Mocha also outputs the results of the test to the terminal with the [reporter](https://mochajs.org/#reporters) of your choice.

### Assertion Library
Think of an assertion library as a simplified way of throwing an error if certain conditions are not met. For instance, say I have the following function:
```
function add(num1, num2) {
  return num1 + num2;
}
```
When *unit testing* this function, I might want to assert that the result of calling `add(1, 3)` should be 4 with the following JavaScript:
```
const result = add(1, 3);
if (result !== 4) {
  throw new Error('Adding 1 and 3 should equal 4');
}
```
This is a very verbose and unwieldy way of writing assertions. Assertion libraries like [expect](https://github.com/mjackson/expect) give us a better way:
```
const result = add(1, 3);
expect(result).toEqual(4, 'Adding 1 and 3 should equal 4');
```
Assertion libraries also provide some added bonuses, such as reporting the expected outcome vs the actual outcome to Mocha in a predictable way so that Mocha can display the results in a clean, readable format. Examples include [Chai.expect](http://chaijs.com/api/bdd/), [Chai.assert](http://chaijs.com/api/assert/), and [expect](https://github.com/mjackson/expect)

### Unit Tests
Unit tests attempt to *isolate* an individual function and ensure that that function does what it says it does. Functions are much easier to unit test when they have their *dependencies injected*, that is to say, when their dependencies are passed in as parameters. Unit tests are typically faster than integration tests since they are testing smaller chunks of code. If a function relies on another function in order to do its job, we typically will *mock out* the functions that are relied on. This allows us to test just the function we care about. There are many libraries which exist to making mocking easier, such as [Sinon.JS](http://sinonjs.org/docs/), [Nock](https://github.com/node-nock/nock),  [Jest](https://facebook.github.io/jest/), or [mockery](https://github.com/mfncooper/mockery).

### Integration Tests
Integration tests attempt to ensure that groups of functions working together provide an expected output. For example, an integration test may make sure that if an HTTP GET request hits my server at the `/cats` route then my server's router handler will send a list of all cats in the database as JSON. In the background, the server's route handler may have interacted with multiple controller functions and database calls. It may also just directly test a function which relies on the results of multiple other functions, and allow the function to call those functions rather than mocking them out like a unit test might. Integration tests are typically slower to run than unit tests.

### Testing front-end code
It's tough to use Node to test code that is meant to run in the browser. Browsers all have different JavaScript engines, have a different implementation of http requests than Node, and do not have any of Node's built-in modules. When testing front-end code we need to run the code in a place that mimics a browser as closely as possible. There are many approaches for this:

#### Browser Automator
A browser automator tests front-end code by actually running an automated version of the browser that you specify. This is as close to the real thing as you can get. An example of a browser automator is [Selenium](http://www.seleniumhq.org/).

#### Headless browser
A headless browser is a lightweight attempt at mimicking a browser for testing without having to perform the resource-intensive practice of actually running a browser. Examples of headless browsers are [PhantomJS](http://phantomjs.org/), [Zombie.js](http://zombie.js.org/), and [CasperJS](http://casperjs.org/). There are [lots](https://github.com/dhamaniasad/HeadlessBrowsers) of headless browsers out there (and most of them have spoooooky names).

Headless browsers are not created equal and each will come with trade-offs. For example, **PhantomJS** is implemented with the Webkit engine, which means it will most closely mimic Safari. It is somewhat low-level and thus scripting interactions with it can be verbose and difficult, but you have a lot of control. **CasperJS** is a scripting utility written around PhantomJS which makes scripting in PhantomJS easier. PhantomJS's engine is not compatible with Node and your PhantomJS tests must be launched via their CLI tool, which means that it's not straightforward to start your Node server before your PhantomJS tests start. PhantomJS can even take screenshots of the page during your tests, and CasperJS provides a way to take a screenshot whenever a test fails.

**Zombie.js**, which runs on top of a Node virtual DOM implementation called [jsdom](https://github.com/tmpvar/jsdom), runs your tests in Node and allows you to easily start your Node server during the tests. It has a rich api for interacting with and making assertions based on the elements within the page. A shortcoming of JSDOM and thus Zombie is that it cannot take screenshots of the page, and also does not mimic an actual browser as closely as PhantomJS.

### Unit Testing front-end code
Front-end libraries and frameworks such as React and Angular are a bit tricky to unit test because of their heavy coupling with the DOM. For instance, I can't just require in a single React Component and make sure it renders 5 cats, because that Component expects to be rendered into the DOM and may rely on `props` and `state` in order to even render correctly. Luckily, these libraries have options of testing utilities that make unit testing them possible.

With React, a very helpful tool is [shallow rendering](https://facebook.github.io/react/docs/test-utils.html#shallow-rendering). This allows us to simulate the rendering of a single component, passing in whatever props we desire and setting its state however we want. Then we can see what the resulting rendered html would look like and ensure that the right elements exist on the page. Libraries such as [enzyme](http://airbnb.io/enzyme/) make shallow rendering easier to work with and allow us to shallow render multiple layers of nested components.

### Test-driven Development
Test-driven development, or TDD, is the process of writing tests for a feature BEFORE adding the actual feature. Advocators of TDD argue that developers who strictly follow TDD end up writing more modular, maintainable, and readable code. Here is the general process to follow:
  1. Identify the feature to be added
  2. Write a test that tests that the feature exists and works
  3. Run your tests and ensure that your new test is failing (because the feature doesn't exist yet)
  4. Write the code to implement your feature and pass the test
  5. Repeat

## Setup
- [ ]  run `npm install` to install dependencies
- [ ]  run `npm test` to run your test suite
- [ ] `npm start` to start your server on port 3000
- [ ]  in another terminal window run `npm run build` to bundle your modules (Note: if you have webpack globally installed you can optionally run `webpack -w` instead.)

## Getting Started - testing
Now we're ready to write some tests!
- [ ] Take a look around and familiarize yourself with the codebase.
  - There's a React app in `src/` and an express server in `index.js`
  - Since the focus of this unit is on testing and not databases, a simplified json "database" is implemented for you in `server/db/`
- [ ] Take some time to really get an understanding of the application.
  - How does the React app get and display the list of games from the server?
  - How does the React app manage game state and game logic?
  - Read over the functions in `server/db/games.js` to understand how our simplified DB works
- [ ] Ensure your build steps work by running `npm start` and navigating your browser to `http://localhost:3000`
- [ ] Check the Chrome dev console and make sure it is free of errors before continuing

## Challenges
- [ ] Complete the unit tests in `test/js/unit.js`
- [ ] Complete the route integration tests in `test/js/supertest.js`
- [ ] Complete the front-end Feature/Integration tests in `test/js/zombie.js`
- [ ] Complete the front-end unit tests in `test/js/enzyme.js`

Your client has complained that saving items to the database is taking too long when multiple requests hit the server at the same time. This is because our naive database implementation is using `readFileSync` and `writeFileSync`, which block the main execution thread of JavaScript while they are running. This is a horrible idea for a server that needs to serve multiple users at the same time! For the next section, we're going to refactor all of our database functions to use the async versions of the fs functions: `readFile` and `writeFile`.

- [ ] Have the db functions in `server/games.js` accept an additional argument, a callback function which will be invoked once any asynchronous functions are done
- [ ] Next, modify your `unit` tests for the database functions to use the asynchronous version of the database functions.
  - Even though the database functions are still synchronous, we are practicing TDD and updating the tests BEFORE refactoring the functions
- [ ] Refactor the db functions to use the async functions `readFile` and `writeFile` and to call the passed in callback function with the result once their async operation is complete
- [ ] Refactor `index.js` (the express server file) to use the new asynchronous db functions correctly
- [ ] As you refactor, run your unit tests often in order to verify that your refactored code works. By the end, all tests should be green again!

## Extension Challenges
- [ ] It would've been really useful to have tests in place for your weekly assessments. Choose a previous assessment to get experience in setting up tests from scratch. Your tests should ensure that the specs outlined in the assessment readme are being adhered to.
- [ ] Add an npm script that uses `eslint` to lint your code. An `.eslintrc` file configured with the airbnb style guide has been provided.
- [ ] Modify the `npm test` script so that it **lints** your code in addition to running the other tests. If there are any lint errors, the test should be counted as a failure.
- [ ] Fix any lint errors that the lint script found so that your tests pass again.
- [ ] Add [blanket](https://www.npmjs.com/package/blanket), a code-coverage library, to your project
- [ ] Following blanket's [Mocha instructions](https://github.com/alex-seville/blanket/blob/master/docs/getting_started_node.md), modify your `npm test` script so that code coverage results are also provided
- [ ] Configure blanket so that a code coverage result of under 70% is counted as a failure
