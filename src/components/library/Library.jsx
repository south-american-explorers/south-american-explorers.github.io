import React, { Component } from "react";
import ArchiveCard from "./ArchiveCard";
import AWS from "aws-sdk";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

AWS.config.region = 'us-east-1'; // Region

AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: 'us-east-1:1cc7d35e-5a84-4d91-ba02-6f0ae4522362', // Cognito_SAEArchiveUnauth_Role
});

class Library extends Component {
  constructor() {
    super();
    this.cardDeck = React.createRef();
    this.state = {
      fetching: false,
      client: new AWS.S3(),
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

  fetchFromBucket(bucketName) {
    this.setState({ fetching: true });
    this.state.client.listObjects({ "Bucket": bucketName }, (err, data) => {
      const state = { fetching: false };
      if (err) {
        console.error(`i have an error bro ${err}`);
      } else {
        const items = [];
        let batch = [];
        for (let i = 0; i < data.Contents.length; i++) {
          console.log('i is', i)
          if (i % this.state.columns === 0) {
            console.log('adding batch to items and resetting - ', batch)
            items.push(batch);
            batch = [];
          }
          const item = data.Contents[i]
          console.log('adding item to batch', item)
          batch.push({ id: item.Key, name: item.Key, size: item.Size });
        }

        if (batch.length > 0) {
          console.log('had some leftovers', batch)
          items.push(batch)
        }

        console.log('items is', items);
        state.items = items;
      }

      this.setState(state);
    });
  }

  getUrl(itemName) {
    return `https://${this.props.bucket}.s3.amazonaws.com/${itemName}`
  }

  getItems() {
    const { items, columns } = this.state;
    if (items.length === 0) return null;

    return items.map((row, rowIndex) => {
      return (
        <Row key={rowIndex} sm={3}>
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