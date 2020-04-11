import React, { PureComponent } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

class Header extends PureComponent {
  render() {
    return (
      <Row className="header">
        <Col xs={8} className="d-flex flex-column justify-content-center">
          <h1>south american explorers.</h1>
        </Col>
        <Col xs={4} className="d-flex flex-column justify-content-center pad-0">
          <InputGroup>
            <Form.Control
              placeholder="Search..."
              aria-label="Search"
              aria-describedby="basic-addon2"
            />
          </InputGroup>
        </Col>
      </Row>
    )
  }
}

export default Header
