import React, { Component } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import randomcolor from 'randomcolor';

import PDFPreview from './PDFPreview';

class ArchiveCard extends Component {

  viewFolder = () => this.props.pushTo(`/?prefix=${this.props.item.name}`)
  viewInBrowser = () => window.open(this.props.item.url)
  getPreview = () => <PDFPreview width={200} url={this.props.item.url} />;

  render() {
    const { item, isFile } = this.props;
    const { name, url = '' } = item; 

    if (!isFile) {
      const bgColor = randomcolor({
         format: 'rgba',
         hue: 'blue',
         luminosity: 'bright',
         alpha: 0.25,
         seed: name,
      });

      return (
        <Card className="height-200">
          <Card.ImgOverlay className="d-flex flex-column jc-space-between fh" style={{ backgroundColor: `${bgColor}`}}>
            <Card.Title className="card-title">{name.slice(0, -1)}</Card.Title>
            <div className="d-flex justify-content-end">
              <Button variant="primary" onClick={this.viewFolder}>View</Button>
            </div>
          </Card.ImgOverlay>
        </Card>
      );
    }

    const parts = name.split('/')
    const title = parts[parts.length - 1];
    return (
      <Card>
        <PDFPreview width={200} url={url} />
        <Card.Body className="d-flex flex-column height-140">
          <Card.Title className="card-title">{title}</Card.Title>
          <div className="d-flex justify-content-end">
            <Button variant="primary" onClick={this.viewInBrowser}>Read</Button>
          </div>
        </Card.Body>
      </Card>
    );
  }
}

export default ArchiveCard;