import React, { Component } from 'react';
import { render } from 'react-dom';
import mapController from './../controller/mapController';

class Job extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
        <div className="job" onClick={() => mapController.sideBarClick(this.props.index)}>
            <p><strong>Title:</strong> {this.props.title}</p>
            <p><strong>Description:</strong> {this.props.description}</p>
            <p><strong>Pay:</strong> {this.props.pay}</p>
            <p><strong>Location:</strong> {this.props.location}</p>
        </div>
        )
    }
}

export default Job;