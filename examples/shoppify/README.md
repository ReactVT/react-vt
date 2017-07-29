# Overview

The Build Tool unit presents the challenge to create the tools and environment needed to start developement on a project. Tooling is highly customizable and determined by the team, the project, and the technologies used. Gaining familiarity with how they work and how to use them empowers you to control all aspects of your projects and to be ready to adopt the tools of any team you join.

You will create build tools using [Webpack](http://webpack.github.io/) and then [Gulp](http://www.gulpjs) to transpile and bundle an existing React app.

### Learning Goals

- [ ] Learn how to use Webpack in development for a React project
- [ ] Learn how to use Gulp to start a project in React

## Getting Started
- Install dependencies: `npm install`

- To Start initial build with Webpack do: `npm run webpack`

- Next do `npm start` and navigate in your browser to [localhost:3000](http://localhost:3000/) to see your built application.

- To use Gulp to bundle your modules do: `npm run gulp`

## Build Tools challenge: Webpack

After the initial build the server starts on port 3000, but the React app doesn't render anything. There are no tests for this unit; use whether or not your app is rendering to check if your build is working correctly.

[Webpack](https://webpack.github.io/docs/) is a module bundler. Even though it works very differently than task runners like Gulp we can use it to accomplish similar results. To learn how to use it in a project you will create a `webpack.config.js` file that will * bundle your React components, * bundle your sass files, * transpile all ES6 and JSX

The goal is to use Webpack to build the app to look and function identically to the app built with Gulp.

- [ ] Create a file called `webpack.config.js` in the project root directory.

- [ ] Set the `client/index.js` file as the entry.

- [ ] Set the bundle to be output as `webpack-bundle.js` in the `build/` folder. 

- [ ] Explore [Loaders](https://webpack.github.io/docs/loaders.html). Loaders can transform your JSX, inline CSS, and a lot [more](https://webpack.github.io/docs/using-loaders.html)

- [ ] Use a loader to transpile the JSX and ES6 in the React app

- [ ] Use a loader to transpile and bundle the SCSS.

You can check that the app is properly bundling by opening the `index.html` in a browser. Use any error messages in the terminal and in the browser developer tools for debugging.

### Webpack Dev Server

When developing leverage the tools webpack has to boost your productivity. Webpack gives us an external module that creates a simple server with built in live reloading. It's cool!

- [ ] Install [Webpack-Dev-Server](https://webpack.github.io/docs/webpack-dev-server.html) You might need to change the `webpack.config.js` file and/or your directory structure for all files to be served properly.
- [ ] Once the webpack-dev-server is running, experiment with live reloading by making changes to the React app with your browser window open to [localhost:8080/build](http://localhost:3000/build).
- [ ] For example: change the body background-color to a nice salmon (#FFA074) and the boxes color to a bright medium orchid (#BA55D3)


## Build tools challenge: Gulp

<em>First lets uncomment the `<script>` tags in the `index.html` so that the correct bundle file is being sourced</em>.

The React application at `client/index.js` needs to be <b>browserifed</b> into the file `client/bundle.js`

- [ ] Browserify must use the `babelify` transform with the following presets:
  - `es2015`: allows transformation of ES6 code to ES5 so that all modern browsers can run the code
  - `react`: allows transformation of </b>jsx</b> syntax to normal JavaScript so that browsers can understand it
- [ ] Write a task that performs a one-time build of the bundle
- [ ] Write a task that uses `watchify` to watch the `src/index.js` file for changes and rebuild as necessary
- [ ] Extension - Modify your build task so that it <b>minifies</b> that built JavaScript
- [ ] Extension - Modify your build task so that it includes <b>source maps</b> with the minified code

The styles are written in [SCSS](http://sass-lang.com/guide), a pre-processed CSS extension that gives powerful features to CSS. They'll need to be compiled to CSS before the styles will work.

- [ ] Write a task that runs a one-time compile of the `scss/application.scss` file into `client/stylesheets/styles.css`
- [ ] Write a task that watches `scss/application.scss` for changes and recompiles to `client/styles.css` whenever the styles are changed
- [ ] Extension - Modify your build task so that it <b>minifies</b> the built CSS
- [ ] Extension - Modify your build task so that it includes <b>source maps</b> with the minified CSS

### Extensions

Go further into build tools with some of these extensions for Gulp and/or Webpack:

- [ ] Incorporate Webpack's [HMR plugin](https://webpack.github.io/docs/hot-module-replacement.html)
- [ ] Install eslint and create a Gulp task to lint all JavaScript files
- [ ] Use either tool to minify images: jpg are usually compressed before being deployed. Download some high-res images [like this bird](https://commons.wikimedia.org/wiki/Category:Colorful_birds#/media/File:Schwarzk%C3%B6pfchen.JPG) and add to the `index.html`. Use a tool to minify/compress the jpg so that load time is quicker on the `index.html`.
