import React, { Component } from 'react';
import mapController from '../controller/mapController.js';

class FormOfInformation extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    let data = {
      'title': this.inputTitle.value,
      'description': this.inputDescription.value,
      'address': this.inputAddress.value,
      'pay': this.inputPay.value
    }
    console.log(data.title);
    $.ajax({
      type: 'POST',
      url: 'http://localhost:3000/post',
      data: data
    })
    .done()
    .fail(function(err) {
      console.log('failed to register');
    });
}


  render() {
    mapController.hideMap();
    return (
      <form onSubmit={this.handleSubmit} method='post'>
        <label className="inputText">
          Title 
          <span>  </span>
          <input className="post-fields" id="title" type="text" ref = {(input) => this.inputTitle = input }/>
        </label>
        <br />
        <br />
        <label className="inputText">
          Description 
          <span>  </span>
          <input className="post-fields" id="description" type="text" ref = {(input) => this.inputDescription = input }/>
        </label>
        <br />
        <br />
        <label className="inputText">
          Address 
          <span>  </span>
          <input className="post-fields" id="address" type="text" ref = {(input) => this.inputAddress = input }/>
        </label>
        <br />
        <br />
        <label className="inputText">
          Pay
          <span>  </span>
          <input className="post-fields" id="pay" type="text" ref = {(input) => this.inputPay = input }/>
        </label>
        <br />
        <br />
        <input type="submit" value="Submit" />
      </form>
    );
  }
}

export default FormOfInformation;