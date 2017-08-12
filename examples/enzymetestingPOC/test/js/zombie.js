const Browser = require('zombie');
const expect = require('expect');
const db = require('../../server/db/games.js');

// Include one of the following assertion libraries if you need to make assertions
// that Zombie does not provide out of the box.
// const expect = require('expect');
// const expect = require('chai').expect;
// const assert = require('chai').assert;

const PORT = process.env.PORT || 3000;

// Start the server
require('../../');

// Regex which matches strings that are a single capital letter A-Z or Qu
describe('Front-end Integration/Features', () => {
  const browser = new Browser();
  browser.silent = true;

  before(done => {
    browser.visit(`http://localhost:${PORT}/`, done);
  });

  describe('Initial display', () => {
    it('loads successfully', () => {
      browser.assert.success();
    });

    it('displays a board', () => {
      browser.assert.element('#board');
    });

    // TODO: Finish tests

    it('displays 3 rows', () => {
      // browser assert elements - rows - 3
      browser.assert.elements('.row', 3);
    });

    it('displays 9 squares', () => {
      browser.assert.elements('.square', 9);
    });
  });

  describe('Game logic', () => {
    it('clicking on square places an X in square', () => {
      // verify that clicked square is now X
      browser.assert.text('.square', '');
      browser.fire('.square', 'click');
      browser.assert.text('.square', 'X');
    });

    it('if X gets 3 in a row, victory message is displayed', () => {
      // target more than one square
      let squareArr = browser.querySelectorAll('.square');
      let innerHTML;
      let result; 
      // simulate a click on square
      browser.fire(squareArr[0], 'click');
      browser.fire(squareArr[5], 'click');
      browser.fire(squareArr[1], 'click');
      browser.fire(squareArr[6], 'click');
      browser.fire(squareArr[2], 'click');
      innerHTML = browser.querySelector('#root').firstChild.firstChild.firstChild.innerHTML;
      result = innerHTML.includes('wins');
      expect(innerHTML).toExist();
      expect(innerHTML.includes('X')).toBe(true);
      expect(result).toBe(true);      
    });

    it('if O gets 3 in a row, victory message is displayed', () => {
      browser.fire('#reset', 'click');
      browser.assert.text('.square', '');
      let squareArr = browser.querySelectorAll('.square');
      let innerHTML;
      let result; 
      // simulate a click on square
      browser.fire(squareArr[5], 'click');
      browser.fire(squareArr[0], 'click');
      browser.fire(squareArr[8], 'click');
      browser.fire(squareArr[1], 'click');
      browser.fire(squareArr[7], 'click');
      browser.fire(squareArr[2], 'click');
      innerHTML = browser.querySelector('#root').firstChild.firstChild.firstChild.innerHTML;
      result = innerHTML.includes('wins');
      expect(innerHTML).toExist();
      expect(innerHTML.includes('O')).toBe(true);      
      expect(result).toBe(true);    
    });
  });

  describe('Lists games from database', () => {
    it('all games from database are listed in #gameList div', () => {
      // TODO: You'll need to require in and query the test DB in order to ensure
      // that the right items show up.

      // query db for all records
      // get LI text from displayed records
      // parse LI
      // compare two values
      let newTab = browser.open('http://localhost:3000');     
      // console.log(db.find());
      // save db find in variable
      const dbRecords = db.find();
      let record = newTab.querySelectorAll('li');
      // extract created At from db  array
      dbRecords.forEach((el, i) => {
        console.log('headless results ', record[i].innerHTML);
        console.log('db results ', el.createdAt);
        expect(record[i].innerHTML.includes(el.createdAt)).toBe(true);
      });
      // compare to innerHtml aray
      // expect for each element in array
      
    });
  });

  describe('Buttons', () => {
    xit('clicking the #reset button clears the game board and sets turn back to X', () => {
    });

    xit('clicking the #clear button removes all listed games', () => {
      // TODO: You'll need to fix the button in src/components/App.js first!
    });
  });
});
