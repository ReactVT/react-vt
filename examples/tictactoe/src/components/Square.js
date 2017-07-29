import React, { PropTypes } from 'react';

const Square = (props) => {
  const { handleClick, letter, row, square } = props;

  return (
    <div className="square" onClick={() => {handleClick(row, square)}}>{letter}</div>
  );
};

Square.propTypes = {
  handleClick: PropTypes.func.isRequired,
  letter: PropTypes.string,
  row: PropTypes.number.isRequired,
  square: PropTypes.number.isRequired
};

export default Square;
