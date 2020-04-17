import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import Amplify from 'aws-amplify';
import awsconfig from 'src/aws-exports';

import Home from './Home'
import Login from './Login'
import Admin from './Admin'

import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css'

Amplify.configure(awsconfig);

class App extends React.Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/admin">
            <Admin />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    )
  }
}

export default App;
