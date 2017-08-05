import React from 'react';
import Photo from './Photo';

const PhotoGrid = React.createClass({

  handleSubmit(e) {
    e.preventDefault();
    this.props.addItem(this.refs.item.value);
  },

  render() {
    return (
      <div className="photo-grid">
        {this.props.posts.map((post,i) => <Photo {...this.props} key={i} i={i} post={post} location={i}/>)}
      </div>
    );
  }
});

export default PhotoGrid;
