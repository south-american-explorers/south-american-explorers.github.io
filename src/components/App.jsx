import React from 'react'
import { Router } from "@reach/router"
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
        <Login path="/login" />
        <Admin path="/admin" />
        <Home path="/" />
      </Router>
    )
  }
}

export default App;
