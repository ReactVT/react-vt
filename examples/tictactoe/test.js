const phantom = require('phantomjs');
phantom.casperPath = '/usr/local/bin/casperjs';
// phantom.injectJs('/usr/local/bin/casperjs/bin/bootstrap.js');
const casper = require('casperjs').create();
// phantomjs.exec('zombie.js');
casper.start('http://google.com');
casper.then(()=> this.echo('First page ' + this.getTitle()));



console.log('Hello, world!');
phantom.exit();