import React from 'react'
import Container from 'react-bootstrap/Container'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'

import Library from "./library";
import Header from "./Header";

import './app.css'

class App extends React.Component {
  render() {
    return (
      <Container fluid>
        <Header />
        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Search..."
            aria-label="Search"
            aria-describedby="basic-addon2"
          />
          <InputGroup.Append>
            <InputGroup.Text id="basic-addon2">Search</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
        <Library />
      </Container>
    )
  }
}

export default App;