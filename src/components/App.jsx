import React from 'react'
import Container from 'react-bootstrap/Container'
import InputGroup from 'react-bootstrap/InputGroup'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import ButtonToolbar from 'react-bootstrap/ButtonToolbar'
import Button from 'react-bootstrap/Button'
import { Document, Page } from 'react-pdf/dist/entry.webpack';
import Modal from 'react-bootstrap/Modal'

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

class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <h1>South American Explorers Archive</h1>
      </div>
    )
  }
}

class Library extends React.Component {
  state = {
    show: false,
    showing: -1,
  }

  handleHide = () => this.setState({ show: false })

  handleView = ({ page, idx }) => {
    this.setState({ showing: idx, show: true });
  }

  getItems() {
    const items = [];
    for (let i = 0; i < 9; i++) {
      items.push(
        <PDFCard
          key={i}
          index={i}
          title={`Item ${i + 1}`}
          subtext="Subtitle"
          handleView={ this.handleView }
        />
      )
    }

    return items;
  }

  render() {
    return (
      <div className="library">
        { this.getItems() }
        <FullscreenPDF show={this.state.show} handleHide={this.handleHide} />
      </div>
    )
  }
}

class PDFCard extends React.Component {
  handleView = () => {
    this.props.handleView({ idx: this.props.index })
  }

  viewInBrowser = () => {
    window.open("./sae-mag-34g-sinking-village-assignment.pdf")
  }

  render() {
    return (
      <Card style={{ margin: '1rem' }}>
        <PDF width={320} />
        <Card.Body style={{ padding: '1rem'}}>
          <Card.Title>{this.props.title}</Card.Title>
          <ButtonToolbar style={{ justifyContent: 'space-between' }}>
            <Button variant="primary" onClick={this.handleView}>Custom</Button>
            <Button variant="primary" onClick={this.viewInBrowser}>Browser</Button>
            <Button variant="outline-secondary" href="./sae-mag-34g-sinking-village-assignment.pdf" download="./sae-mag-34g-sinking-village-assignment.pdf">Download</Button>
          </ButtonToolbar>
        </Card.Body>
      </Card>
    )
  }
}

class PDF extends React.Component {
  state = {
    numPages: null,
    pageNumber: 1,
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  }

  render() {
    return (
      <div>
        <Document file="./sae-mag-34g-sinking-village-assignment.pdf" onLoadSuccess={this.onDocumentLoadSuccess}>
          <Page width={this.props.width || null } pageNumber={this.state.pageNumber} />
        </Document>
      </div>
    )
  }
}

class FullscreenPDF extends React.Component {
  state = {
    numPages: null,
    pageNumber: 1,
  }

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages, pageNumber: 1 });
  }

  changePage = offset => this.setState({
    pageNumber: this.state.pageNumber + offset,
  });

  prevPage = () => this.changePage(-1);
  nextPage = () => this.changePage(1);

  render() {
    return (
      <Modal
        show={this.props.show}
        onHide={this.props.handleHide}
        dialogClassName="modal-width-fit-content"
        aria-labelledby="[PDF TITLE NAME HERE]"
      >
        <Modal.Header closeButton>
          <ButtonToolbar style={{ justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
            <Button
              variant="outline-secondary"
              onClick={this.prevPage}
              disabled={this.state.pageNumber == 1}
            >
              Prev Page
            </Button>
            <Modal.Title id="fullscreen-pdf" style={{ fontSize:'1rem' }}>{`Page ${this.state.pageNumber} of ${this.state.numPages}`}</Modal.Title>
            <Button
              variant="outline-secondary"
              onClick={this.nextPage}
              disabled={this.state.pageNumber == this.state.numPages}
            >
              Next Page
            </Button>
          </ButtonToolbar>
        </Modal.Header>
        <Modal.Body>
          <div>
            <Document file="./sae-mag-34g-sinking-village-assignment.pdf" onLoadSuccess={this.onDocumentLoadSuccess}>
              <Page pageNumber={this.state.pageNumber} />
            </Document>
          </div>
        </Modal.Body>
      </Modal>
    )
  }
}

export default App;