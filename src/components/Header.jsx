import React, { PureComponent } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { withRouter } from 'react-router-dom';

class Header extends PureComponent {
  handleHome = () => {
    this.props.history.push('/');
  }

  handleLogin = () => {
    this.props.history.push('/login');
  }

  render() {
    const { titleOnly = false } = this.props;
    const width = titleOnly ? 12 : 8;

    return (
      <Row className="header">
        { this.props.titleOnly ? null : (<Col xs={2} className="d-flex justify-content-end pad-0" />) }

        <Col xs={width} className="d-flex flex-column align-items-center">
          <h1 onClick={this.handleHome}>south american explorers.</h1>
        </Col>

        { this.props.titleOnly ? null : (
          <Col xs={2} className="d-flex justify-content-end pad-0">
            <Button onClick={this.props.onClick || this.handleLogin}>{ this.props.buttonTitle || "Login" }</Button>
          </Col>
        ) }

      </Row>
    )
  }
}

export default withRouter(Header);
