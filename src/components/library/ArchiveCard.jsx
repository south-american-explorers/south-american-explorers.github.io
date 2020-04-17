import React, { PureComponent } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import randomcolor from 'randomcolor';

import PDFPreview from './PDFPreview';
import { Storage } from 'aws-amplify';
import { S3Image } from 'aws-amplify-react';

// const COLORS = ['#9196a0', '#dfbbb1', '#f56476', '#e43f6f'];
// const randomColor = () => {
//   const index = Math.floor(Math.random() * COLORS.length);
//   return COLORS[index];
// }

class ArchiveCard extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { fetching: props.isFile };
  }

  componentDidMount() {
    Storage.get(`${this.props.item.name}`, {
      // download: true,
      contentEncoding: 'application/pdf',
      contentDisposition: 'inline'
    })
    .then(url => this.setState({ fetching: false, src: url }))
    .catch(err => this.setState({ fetching: false, err: true }))
  }

  viewFolder = () => this.props.pushTo(`/?prefix=${this.props.item.name}`)
  viewInBrowser = () => window.open(this.state.src)

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
      // const bgColor = randomColor();

      return (
        <Card className="height-200">
          <Card.ImgOverlay className="d-flex flex-column jc-space-between fh" style={{ backgroundColor: `${bgColor}`}}>
            <Card.Title className="card-title card-title-folder">{name.slice(0, -1)}</Card.Title>
            <div className="d-flex justify-content-end">
              <Button variant="primary" onClick={this.viewFolder}>View Issues</Button>
            </div>
          </Card.ImgOverlay>
        </Card>
      );
    }

    // if (this.state.fetching) {
    //   return <div>Fetching...</div>
    // }

    const parts = name.split('/')
    const title = parts[parts.length - 1];

    return (
      <Card>
        <S3Image className="fw" imgKey={`images/${name}`} />
        <Card.Body className="d-flex flex-column height-140">
          <Card.Title className="card-title">{title}</Card.Title>
          <div className="d-flex justify-content-end">
            <Button variant="primary" onClick={this.viewInBrowser} disabled={this.state.fetching}>Read</Button>
          </div>
        </Card.Body>
      </Card>
    );
  }
}

export default ArchiveCard;