import React, { Component } from 'react';
import mapController from '../controller/mapController.js';

class SignUpForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.authorize = this.props.authFunc,
    this.auth = this.props.auth;
  }
  handleSubmit(event) {
    event.preventDefault();

    let data = {
      'username': this.inputUsername.value,
      'password': this.inputPassword.value,
    }
    console.log(data.title);
    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/signup',
      data: data
    })
    .done(
    // if username saved successfully, have ajax success callback  modify the authed flag 
    // use set timeout to switch back to auth = false;
      this.authorize()
    )
    .fail(function(err) {
      console.log('failed to register');
    });
  }

  render() {
    console.log('SIGNUP');
    mapController.hideMap();
    return (
      <form onSubmit={this.handleSubmit} method='post'>
        <label className="inputText">
          Username
          <span>  </span>
          <input className="post-fields" id="username" type="text" ref = {(input) => this.inputUsername = input }/>
        </label>
        <br />
        <br />
        <label className="inputText">
          Password
          <span>  </span>
          <input className="post-fields" id="password" type="password" ref = {(input) => this.inputPassword = input }/>
        </label>
        <br />
        <br />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default SignUpForm;