import React, { PureComponent } from 'react';
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import { withRouter } from 'react-router-dom';

import AWS from 'aws-sdk';
import {
  // AuthenticationDetails,
  CognitoUserPool,
  // CognitoUser
} from 'amazon-cognito-identity-js';

class Login extends PureComponent {
  constructor() {
    super();
    this.usernameRef = React.createRef();
    this.passwordRef = React.createRef();
  }

  handleCancel = () => {
    this.props.history.push('/');
  }

  handleLogin = () => {
    const poolData = {
      UserPoolId: 'us-east-1_aJbpn1wXS', // Your user pool id here
      ClientId: '708ghdvttsljnfrvbj6v7cbac8', // Your client id here
    };
    const userPool = new CognitoUserPool(poolData);
    console.log('userPool', userPool) 
    const cognitoUser = userPool.getCurrentUser();
    console.log('cognitoUser', cognitoUser)
    if (cognitoUser !== null) {
      console.log('user cognitoUser', cognitoUser)

      cognitoUser.getSession((err, result) => {
        if (result) {
          console.log('result', result)
          AWS.config.region = 'us-east-1'; // Region
          AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: 'us-east-1:1cc7d35e-5a84-4d91-ba02-6f0ae4522362', // Cognito_SAEArchiveUnauth_Role
            Logins: {
              'cognito-idp.us-east-1.amazonaws.com/us-east-1_aJbpn1wXS': result.getIdToken().getJwtToken(),
            },
            LoginId: 'sar228@cornell.edu'
          });
          console.log(AWS.config.credentials)    
        } else {
          console.log('error', err)
        }
      })
    }
  }

  render() {
    return (
      <Container className="d-flex justify-content-center flex-column full-height">
        <Row className="header">
          <Col className="d-flex justify-content-center">
            <h1>south american explorers.</h1>
          </Col>
        </Row>
        <Row className="justify-content-center">
          <Col xs={8} sm={8} md={6}>
            <div>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroup-sizing-default">Username</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  ref={this.usernameRef}
                  aria-label="Default"
                  aria-describedby="inputGroup-sizing-default"
                />
              </InputGroup>
              <br />
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroup-sizing-default">Password</InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  ref={this.passwordRef}
                  aria-label="Default"
                  aria-describedby="inputGroup-sizing-default"
                />
              </InputGroup>
              <br />
              <Col xs className="d-flex justify-content-end pad-0">
                <Button onClick={this.handleCancel} variant="secondary">Cancel</Button>
                <Button onClick={this.handleLogin} className="margin-left-8">Login</Button>
              </Col>
            </div>
          </Col>
        </Row>
      </Container>
    )
  }
}

export default withRouter(Login);