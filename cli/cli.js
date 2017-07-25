#!/usr/bin/env node
const commander = require('commander');


commander
  .option('-b, --bundle <bundle>', 'Path to React bundle file')
  .option('-m, --html <html>', 'Path to html page')
  .parse(process.argv);

commander.name = 'react-vt';

// ADD ERROR HANDLING
if (commander.bundle) console.log('bundle here');
if (commander.html) console.log('html here');
