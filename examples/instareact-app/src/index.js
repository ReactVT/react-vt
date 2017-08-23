import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import injector from './../../../src/inject.js';

class List extends React.Component {
  constructor() {
    super();
    this.state = {
      posts: [],
    };
    this.picSearch('https://codesmith-precourse.firebaseio.com/instagram/-JqL35o8u6t3dTQaFXSV.json');
  }

  componentWillMount() {
    injector(React, this);
  }

  picSearch(term) {
    fetch(term).then((response) => {
      response.json().then((data) => {
        this.picValidate(data);
      });
    });
  }

  addPic(pic) {
    const newPosts = this.state.posts.slice();
    if (!newPosts.includes(pic)) {
      newPosts.push(pic);
    }
    this.setState({ posts: newPosts });
  }

  picValidate(data) {
    const self = this;
    let count = 0; 
    data.forEach((pic) => {
      fetch(pic)
     .then((response) => {
       if (response.status !== 200) {
      // Error text could be added here if desired
         return;
       }
       count++; 
       if (count < 5) self.addPic(pic);
     }
    )
    .catch((err) => {
    });
  // Error text could be added here if desired
    });
  }

  render() {
    const posts = this.state.posts.map((url) => {
      return (
        <PostItem key={url} url={url} />
      );
    });
    return (
      <div>
        {posts}
      </div>
    );
  }
}

class PostItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: props.url, 
      likes: 7, 
      liked: false
    };
  }

  liked() {
    if(this.state.liked) {
      const likey = this.state.likes - 1;
      this.setState({ likes: likey, liked: false});
      return; 
    } 
      const likey = this.state.likes + 1; 
      this.setState({ likes: likey, liked: true});
  }

  render() {
    const self = this; 
    return (
      <div className="post">
        <div className="postHeader">
          <img src="profile.jpg" alt="huh" className="logoPic" />
          <div className="headerText">
            <p className="name">brischmalz</p>
            <p className="location">Altadena, CA</p>
          </div>
          <p className="date">3d</p>
        </div>
        <img src={this.state.url} alt="profile" className="postPic" onDoubleClick={() => this.liked()}/>
        <Social likes={this.state.likes} liked={this.state.liked} 
        likeClick={() => this.liked()}/>
      </div>
    );
  }
}

class Social extends React.Component {
  constructor(props) {
    super(props);
    this.likeClick = props.likeClick; 
    this.state = {
      comments: [{ user: 'username', comment: 'Sup Yo', key: 0 }]
    };
  }


  render() {
    const comments = this.state.comments.map(comment =>
      <Comment key={comment.key} user={comment.user} comment={comment.comment} />
    );

    return (
      <div>
        <p className="likes">{this.props.likes} likes</p>
        <div className="comments">
          {comments}
        </div>
        <div className="social">
          <LikeButton onClick={() => this.likeClick()} liked={this.props.liked} />
          <InputComment
            onEnter={(input) => {
              const add = { user: 'bschmalz', comment: input, key: getKey.getKey() };
              const newComments = this.state.comments.slice();
              newComments.push(add);
              this.setState({ comments: newComments });
            }}
          />
        </div></div>);
  }
}

const getKey = {
  key: 0,
  getKey: () => {
    getKey.key += 1;
    return getKey.key;
  }
};

class InputComment extends React.Component {
  constructor(props) {
    super(props);
    this.onEnter = props.onEnter;
    this.state = {
      value: ''
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    if (event.key === 'Enter') {
      this.onEnter(this.state.value);
      this.setState({ value: '' });
      return;
    }
    const val = this.state.value + event.key;
    this.setState({ value: val });
  }

  render() {
    return (
      <input
        type="text"
        className="addComment"
        placeholder="Add a comment..."
        value={this.state.value}
        onKeyPress={this.handleChange}
      />
    );
  }
}

const Comment = props =>
  <p className="comment"><span className="userLink">{props.user}</span>{props.comment}</p>;

const LikeButton = (props) => {
  const liked = props.liked;
  const str = liked ? 'fa fa-heart fa-2x likeButton liked' : 'fa fa-heart-o fa-2x likeButton';
  return (
    <i className={str} aria-hidden="true" onClick={props.onClick} />
  );
};

ReactDOM.render(
  <List />,
  document.getElementById('feed')
);
