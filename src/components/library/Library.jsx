import React, { Component } from "react";
import ArchiveCard from "./ArchiveCard";
import AWS from "aws-sdk";
import CardDeck from "react-bootstrap/CardDeck";
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
        state.items = data.Contents.map(item => ({
          id: item.Key,
          name: item.Key,
          size: item.Size,
        }));
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
    const batches = Math.ceil(items.length / columns);
    const rendered = [];
    console.log("here", batches);
    // b0 i0 b0 i1 b0 i2 b0 i3
    // b1 i4 b1 i5
    let row = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      console.log('item', item);

      row.push(
        <Col xs={2 * Math.ceil(12/columns)} md={Math.ceil(12/columns)}>
          <ArchiveCard
            key={items[i].id}
            title={items[i].name}
            url={this.getUrl(items[i].name)}
          />
        </Col>
      );

      if (row.length === columns) {
        console.log('have', row.length, 'items, creating new row');
        rendered.push(<Row sm={12}>{row}</Row>);
        row = [];
      }
    }

    if (row.length) {
      rendered.push(<Row sm={12}>{row}</Row>);
    }
    console.log('rendered', rendered);
    return rendered;
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