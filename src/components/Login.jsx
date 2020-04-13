import React, { PureComponent } from 'react';
import Container from 'react-bootstrap/Container'
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

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

    Auth.signIn(username, password)
      .then(user => {
        // notification.success({
        //   message: 'Succesfully logged in!',
        //   description: 'Logged in successfully, Redirecting you in a few!',
        //   placement: 'topRight',
        //   duration: 1.5
        // });

        this.props.history.push('/admin');
      })
      .catch(err => {
        // notification.error({
        //   message: 'Error',
        //   description: err.message,
        //   placement: 'topRight'
        // });

        console.log(err);

        // this.setState({ loading: false });
      });
  }

  render() {
    return (
      <Container className="d-flex justify-content-center flex-column full-height">
        <Header />
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
                    />
                  </InputGroup>
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
