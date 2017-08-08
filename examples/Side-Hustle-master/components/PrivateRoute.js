import React, { Component } from 'react';
import { Route, Redirect }from 'react-router-dom';
import { render } from 'react-dom';
import mapController from './../controller/mapController';


export default function PrivateRoute ({component: Component, auth}) {
  return (
    <Route
      render={(props) => auth === true
        ? <Component {...props} />
        : <Redirect to={{pathname: '/login', state: {from: props.location}}} />}
    />
  )
}