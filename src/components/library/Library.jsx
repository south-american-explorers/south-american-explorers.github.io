import React, { Component } from 'react';
import ArchiveCard from './ArchiveCard';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Storage } from 'aws-amplify';

class Library extends Component {
  constructor() {
    super();
    this.cardDeck = React.createRef();
    this.state = {
      fetching: false,
      items: [],
      columns: 4,
    };
  }

  componentDidMount() {
    if (!this.state.fetching) {
      this.fetchFromBucket(this.props.bucket);
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.bucket !== this.props.bucket) {
      this.fetchFromBucket(this.props.bucket)
    }
  }

  createRows = data => {
    return new Promise((resolve, reject) => {
      const items = [];
      let batch = [];
      data = data.filter(item => !item.key.endsWith('/') && item.key !== '');
      for (let i = 0; i < data.length; i++) {
        if (i % this.state.columns === this.state.columns - 1) {
          items.push(batch);
          batch = [];
        }
        const item = data[i]
        batch.push({ id: item.key, name: item.key, size: item.size });
      }

      if (batch.length > 0) items.push(batch)
      return resolve(items)
    });
  }

  fetchFromBucket(bucketName) {
    this.setState({ fetching: true });

    Storage.list('')
      .then(this.createRows)
      .then(items => this.setState({ items, fetching: false }))
      .catch(err => console.log(err));
  }

  getUrl(itemName) {
    return `https://${this.props.bucket}.s3.amazonaws.com/${itemName}`
  }

  getItems() {
    const { items: rows } = this.state;
    if (rows.length === 0) return null;

    return rows.map((row, rowIndex) => {
      return (
        <Row key={rowIndex} className="pad-bottom-24" sm={3}>
          { 
            row.map(item => (
              <Col key={item.id} sm={3}>
                <ArchiveCard
                  key={item.id}
                  title={item.name}
                  url={this.getUrl(item.name)}
                />
              </Col>
            ))
          }
        </Row>
      );
    })
  }

  render() {
    return (
      <div>
        { this.state.fetching ? "fetching.." : this.getItems() }
      </div>
    )
  }
}

export default Library