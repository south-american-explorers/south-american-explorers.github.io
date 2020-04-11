import React, { Component } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import PDFPreview from "./PDFPreview";

class ArchiveCard extends Component {
  viewInBrowser = () => {
    window.open(this.props.url)
  };

  getPreview = () => <PDFPreview width={200} url={this.props.url} />;

  render() {
    return (
      <Card>
        <PDFPreview width={200} url={this.props.url} />
        <Card.Body className="d-flex flex-column height-140">
          <Card.Title className="card-title">{this.props.title}</Card.Title>
          <div className="d-flex justify-content-end">
            <Button variant="primary" onClick={this.viewInBrowser}>Read</Button>
          </div>
        </Card.Body>
      </Card>
    )
  }
}

export default ArchiveCard;