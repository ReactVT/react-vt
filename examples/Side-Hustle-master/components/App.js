import React, { Component } from 'react';
import { render } from 'react-dom';
import ViewJob from './viewJob.js';
import Job from './Job.js';
import Navbar from './Navbar.js';
import FormOfInformation from './Form.js';
import SignUpForm from './SignUp.js';
import LogInForm from './LogIn.js';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import $ from 'jquery';
import mapController from './../controller/mapController'
import PrivateRoute from './PrivateRoute.js'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.state.auth = false;
        this.authorize = this.authorize.bind(this);
    }

    retrieveDataFromServer() {
        console.log('running')
        $.get('http://localhost:3000/api', (data) => {
          this.parseDataFromServer(data);
        });
    }

    parseDataFromServer(data) {
      let validLocations = mapController.getDistance(data);
       validLocations.then(jobdata => {
         mapController.filteredData = jobdata;
         this.setState({'jobs': jobdata})
         sessionStorage.setItem('jobs', JSON.stringify(jobdata));
       });
    }
    // Creates a job component for each job request in the database
    componentDidMount() {
        this.retrieveDataFromServer();
        console.log('passed');
        console.log('from session', sessionStorage.getItem('jobs'));
        console.log(JSON.parse(sessionStorage.getItem('jobs')))
    }

    authorize() {
        this.setState({auth : true});
    }

    render() {
        // ViewJob Component with relevant props passed down 

        const navBar = (props) => {
            return (
                <Navbar />
            );
        }
        const SignUp = (props) => {
            return (
                <SignUpForm auth={this.state.auth} authFunc={this.authorize}/>
            );
        }
        const LogIn = (props) => {
            return (
                <LogInForm auth={this.state.auth} authFunc={this.authorize}/>
            );
        }

        const viewJob = (props) => {
            console.log('state jobs', this.state.jobs);
            return (
                // <ViewJob jobs={this.state.jobs} />
                <ViewJob jobs={JSON.parse(sessionStorage.getItem('jobs'))} />
            );
        }

        const form = (props) => {
            return (
                <FormOfInformation />
            )
        }
        
        return (
            // React Router is used to render components based on the route specified
            <div>
                <Navbar />
                <Switch>
                    <Route path='/SignUp' component={SignUp} />
                    <Route path='/LogIn' component={LogIn} />
                    {/*<Route path="/PostJob" component={form} />*/}
                    {/*<Route path="/ViewJob" component={viewJob} />*/}
                    <PrivateRoute auth={this.state.auth} path='/ViewJob' component={viewJob} />
                    <PrivateRoute auth={this.state.auth} path='/PostJob' component={form} />
                </Switch>
            </div>
        )
    }
}

export default App;