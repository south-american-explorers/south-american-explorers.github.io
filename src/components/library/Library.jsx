import React, { Component } from 'react';
import ArchiveCard from './ArchiveCard';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Storage } from 'aws-amplify';
import awsconfig from 'src/aws-exports';
import { withRouter } from 'react-router-dom';

const FILE = 'file';
const FOLDER = 'folder';
const LIBRARY_TYPES = new Set([FILE, FOLDER]);

const getUrl = name => {
  return `https://${awsconfig.aws_user_files_s3_bucket}.s3.amazonaws.com/public/${name}`
}

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
      this.fetchFromBucket();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.location.search !== prevProps.location.search) {
      this.fetchFromBucket();
    }
  }

  getQueryParams(props) {
    if (!props) props = this.props;

    const { location: { search = '' } = {} } = this.props;
    return search.slice(1).split('&').reduce((acc, qp) => {
      const [key, value] = qp.split('=')
      acc[key] = value;
      return acc;
    }, {});
  }

  createRows = data => {
    return new Promise((resolve, reject) => {
      const { columns } = this.state;
      const { prefix = '' } = this.getQueryParams();
      const items = [];
      let batch = [];

      console.log('data', data);
      console.log('prefix', prefix);
      const folders = new Set();
      data = data.filter(datum => datum.key !== '')
        .filter(d => {
          console.log(d.key, prefix, d.key.includes(prefix));
          const parts = d.key.split('/');

          // hack to get folders
          if (parts.length > 1 && prefix !== `${parts[0]}/`) {
            folders.add(`${parts[0]}/`)
          }

          if (prefix === '') {
            const split = d.key.split('/');
            // if its a top level key, it will not have any '/' or if its a top level folder,
            // it will have an empty string in position 1
            return split.length === 1 || split[1] == '';
          } else if (d.key !== prefix && d.key.includes(prefix)) {
            return true;
          }

          return false;
        }).sort((a, b) => {
          const datumA = a.key.toUpperCase();
          const datumB = b.key.toUpperCase();
          if (a < b) return -1;
          else if (a > b) return 1;
          return 0;
        });

      Array.from(folders).sort().forEach(folder => {
        data.unshift({ key: folder, name: folder, type: FOLDER })
      });

      for (let i = 0; i < data.length; i++) {
        if (i % columns === columns - 1) {
          items.push(batch);
          batch = [];
        }

        const item = data[i]
        const formatted = {
          id: item.key,
          name: item.key,
          type: item.key.endsWith('/') ? FOLDER : FILE,
        };

        if (formatted.type === FILE) {
          formatted.url = getUrl(formatted.name);
        }

        batch.push(formatted);
      }

      if (batch.length > 0) items.push(batch)
      return resolve(items)
    });
  }

  fetchFromBucket() {
    const { prefix  = '' } = this.getQueryParams();
    this.setState({ fetching: true });

    Storage.list(prefix)
      .then(this.createRows)
      .then(items => this.setState({ items, fetching: false }))
      .catch(err => console.log(err));
  }

  getItems() {
    const { items: rows, columns } = this.state;
    if (rows.length === 0) return null;

    return rows.map((row, rowIndex) => {
      return (
        <Row key={rowIndex} className="pad-bottom-24">
          { 
            row.map(item => (
              <Col key={item.id} sm={4}>
                <ArchiveCard
                  key={item.id}
                  item={item}
                  isFile={item.type === FILE}
                  pushTo={this.props.history.push}
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

export default withRouter(Library)