import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { navigate } from '@reach/router';

function Header(props) {
  const handleHome = () => {
    navigate('/');
  }

  const handleLogin = () => {
    navigate('/login');
  }

  const defaultRightButton = {
    onClick: handleLogin,
    title: 'Login'
  };

  let { leftButton = null, rightButton, titleOnly = false } = props;
  const width = 8;

  if (!titleOnly && rightButton == null) {
    rightButton = defaultRightButton
  }

  return (
    <Row className="header">
      <Col xs={2} className="d-flex justify-content-start pad-0">
        { leftButton === null
            ? null
            : (<Button onClick={leftButton.onClick}>{ leftButton.title }</Button>)
        }
      </Col>

      <Col xs={width} className="d-flex flex-column align-items-center justify-content-center">
        <h1 className="header-title" onClick={handleHome}>south american explorers.</h1>
      </Col>

      <Col xs={2} className="d-flex justify-content-end pad-0">
        { rightButton == null ? null : (
          <Button onClick={rightButton.onClick}>{ rightButton.title }</Button>
        ) }
      </Col>

    </Row>
  )
}

export default Header;
