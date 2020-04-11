import React, { PureComponent } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { withRouter } from "react-router";

class Footer extends PureComponent {

  handleClick = () => {
    this.props.history.push('/login');
  }

  render() {
    return (
      <Row className="header">
        <Col xs className="d-flex justify-content-end pad-0">
          <Button onClick={this.handleClick}>Login</Button>
        </Col>
      </Row>
    )
  }
}

export default withRouter(Footer)
