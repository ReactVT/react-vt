import React, { PropTypes, Component } from 'react';
function getInitialState() {
  return {
    text: 'first button',
  };
}

class GameList extends Component {
    constructor(props) {
    super(props);
    this.state = getInitialState();
  }

  componentDidMount() {
    // let self = this;
    // setTimeout(function() {
    //   self.setState({
    //     text: 'second button'});
    // }, 6000);
  }

  render() {
    const gameList = this.props.gameList;
    const listElements = gameList.map(game => (
      <li key={game.createdAt}>{game.winner} won at {game.createdAt}</li>
    ));
    return (
      <div id="gameList">
        <button>{ this.state.text }</button>
        <h3>Previous matches</h3>
        <ul>
          {listElements}
        </ul>
      </div>
    );
  }
}

GameList.propTypes = {
  gameList: PropTypes.array.isRequired,
};

export default GameList;
