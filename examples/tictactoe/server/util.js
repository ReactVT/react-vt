var util = {};

/**
* Insert score into scores array at correct index and return its index
*
* @param score - Object
* @param highScores - Array
*/
util.insertScore = function(newScore, highScores) {
  // TODO: Fix me so that my tests pass
  return highScores.push(newScore);
};

module.exports = util;
