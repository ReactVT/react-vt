import React, { PropTypes } from 'react';
import Square from './Square';

const Row = (props) => {
  const { letters, handleClick, row } = props;
  const squareElements = letters.map((letter, i) => (
    <Square key={row + i} row={row} square={i} letter={letter} handleClick={handleClick} />
  ));
  return (
    <div className="row">
      {squareElements}
    </div>
  );
};

Row.propTypes = {
  letters: PropTypes.arrayOf(PropTypes.string).isRequired,
  handleClick: PropTypes.func.isRequired,
  row: PropTypes.number.isRequired,
};

export default Row;
