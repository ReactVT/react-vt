import React, { Component } from 'react';
import { render } from 'react-dom'
import Job from './Job.js'
import mapController from '../controller/mapController.js';

class ViewJob extends Component {
    constructor(props) {
        super(props)
        this.parseDataFromServer = this.parseDataFromServer.bind(this);
        this.setLocation = this.setLocation.bind(this);
        this.getLocation = this.getLocation.bind(this);
    }

    setLocation() {
        const promise = mapController.setLocation();
        promise.then((data) => {
           mapController.pos = data; 
           mapController.map.setCenter(mapController.pos);
           this.parseDataFromServer();
        });  
    }

    getLocation() {

        let promise = mapController.getLocation();
        promise.then((data) => { 
          mapController.pos = data; 
          mapController.map.setCenter(mapController.pos);
          this.parseDataFromServer()
        });
    }

    parseDataFromServer() {
      let data = mapController.data; 
      console.log('data parsedatafrom server', data);
      let validLocations = mapController.getDistance(data);
       validLocations.then(jobdata => {
         mapController.filteredData = jobdata;
         mapController.placeMarkers(jobdata);
         this.setState({'jobs': jobdata})
       });
    }

    render() {
        let data = this.props.jobs;
        console.log('data in render', data)
        let jobs = data.map((dataPoint, index) => {
            return <Job title={dataPoint.title} index={index} description={dataPoint.description} pay={dataPoint.pay} location={dataPoint.address} onClick={() => console.log(index)}/>
        });
        // executes mapController.showMap before this.props.jobs
        mapController.showMap();
        return (
            <div>
            <div id='location'>
            <h4 id="setLocation">Set Location</h4>
              <input id="locationInput" type="text"/>
              <button id="locationButton" onClick={this.setLocation}>Set Location</button>
              <button id="currentLocationButton" onClick={this.getLocation}>Use Current Location</button>
            </div>
            <div id='viewjobs'>
                {jobs}
            </div>
            </div>
        )
    }
}

export default ViewJob;