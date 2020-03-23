import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Button from "react-bootstrap/Button";
import PDFPreview from "./PDFPreview";

class ArchiveCard extends Component {
  viewInBrowser = () => {
    window.open("./sae-mag-34g-sinking-village-assignment.pdf")
  };

  render() {
    return (
      <Card style={{ margin: '1rem' }}>
        <PDFPreview width={320} />
        <Card.Body style={{ padding: '1rem'}}>
          <Card.Title>{this.props.title}</Card.Title>
          <ButtonToolbar style={{ justifyContent: 'space-between' }}>
            <Button variant="primary" onClick={this.viewInBrowser}>Browser</Button>
            <Button variant="outline-secondary" href="./sae-mag-34g-sinking-village-assignment.pdf" download="./sae-mag-34g-sinking-village-assignment.pdf">Download</Button>
          </ButtonToolbar>
        </Card.Body>
      </Card>
    )
  }
}

export default ArchiveCard;