'use strict';
const fs = require('fs');
let gamesList;
let writeLocation;

if (process.env.NODE_ENV === 'test') {
  writeLocation = `${__dirname}/games.test.json`;
  gamesList = require(writeLocation);
} else {
  writeLocation = `${__dirname}/games.dev.json`;
  gamesList = require(writeLocation);
}

const db = {};

/**
 * #create - Adds a unique ID and a createdAt date in the form of an ISO string to
 *           the game, and then appends it to the array of games in the games.env.json file.
 *
 * @param {Object} game - The new game to be added to the DB
 * @return {Object} the game that was created
 */
db.create = game => {
  // check game winner field
  // if it is X or O, create new game
  // otherwise throw error
  if (game.winner !== 'X' && game.winner !== 'O') throw new Error('No winner in game');
  const newGame = Object.assign(game, {
    id: gamesList.length,
    createdAt: new Date().toISOString(),
  });
  gamesList.push(newGame);
  fs.writeFileSync(writeLocation, JSON.stringify(gamesList, null, 2));
  return gamesList.slice(-1)[0];
};

/**
 * #find - Returns the entire list of games from the appropriate games.env.json file.
 *
 * @return {Array} the list of games
 */
db.find = () => gamesList;

/**
 * #drop - Deletes everything from the appropriate games.env.json file and writes
 *         an empty array in its place.
 *
 * @return {boolean} whether or not the drop succeeded
 */
db.drop = () => {
  gamesList = [];
  fs.writeFileSync(writeLocation, JSON.stringify(gamesList, null, 2));
  return true;
};

db.reset = () => {
  gamesList = JSON.parse(fs.readFileSync(writeLocation));
};

module.exports = db;
