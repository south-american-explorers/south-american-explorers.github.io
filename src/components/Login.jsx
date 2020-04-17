import React, { PureComponent } from 'react';
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';

import { withRouter } from 'react-router-dom';
import { Auth } from 'aws-amplify';

import Header from './Header';

const SPINNER_DELAY = 1500

class Login extends PureComponent {
  constructor() {
    super();
    this.usernameRef = React.createRef();
    this.passwordRef = React.createRef();
    this.state = { fetchingUser: true };
  }

  componentDidMount() {
    Auth.currentAuthenticatedUser()
      .then(() => {
        setTimeout(() => {
          this.setState({ fetchingUser: false })
          this.props.history.push('/admin');
        }, SPINNER_DELAY);
      })
      .catch(err => {
        setTimeout(() => this.setState({ fetchingUser: false }), SPINNER_DELAY);
      })
  }

  handleCancel = () => {
    this.props.history.push('/');
  }

  handleLogin = () => {
    const username = this.usernameRef.current.value;
    const password = this.passwordRef.current.value;

    this.setState({ loading: true, error: null })
    Auth.signIn(username, password)
      .then(user => {
        this.props.history.push('/admin');
      })
      .catch(error => {
        if (error.code === 'UserNotFoundException' || error.code === 'InvalidParameterException') {
          error = { message: "Invalid username or password." }
        }
        this.setState({ loading: false, error });
      });
  }

  render() {
    return (
      <Container className="d-flex justify-content-center flex-column full-height">
        <Header titleOnly />
        <Row className="justify-content-center">
        { this.state.fetchingUser ? (
            <Spinner animation="border" role="status" />
            ) : (
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
                      type="password"
                    />
                  </InputGroup>
                  { this.state.error ? (
                    <>
                      <br />
                      <Alert variant="danger">
                        { `Error signing you in: ${ this.state.error.message }` }
                      </Alert>
                    </>
                    ) : null 
                  }
                  <br />
                  <Col xs className="d-flex justify-content-end pad-0">
                    <Button onClick={this.handleCancel} variant="secondary">Cancel</Button>
                    <Button onClick={this.handleLogin} className="margin-left-8">Login</Button>
                  </Col>
                </div>
              </Col>
            ) }
        </Row>
      </Container>
    )
  }
}

export default withRouter(Login);
