import React, { Component } from 'react';
import ArchiveCard from './ArchiveCard';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { Storage } from 'aws-amplify';

import { getQueryParams } from '../utils';

const FILE = 'file';
const FOLDER = 'folder';

class Library extends Component {
  static getDerivedStateFromProps(props, state) {
    if (props.location.search && state.columns !== 4) {
      return { columns: 4 }
    } else if (!props.location.search && state.columns !== 3) {
      return { columns: 3 }
    }

    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      fetching: false,
      items: [],
      columns: props.location.search ? 4 : 3,
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

  createRows = data => {
    return new Promise((resolve, reject) => {
      const { columns } = this.state;
      const { prefix = '' } = getQueryParams(this.props);

      const items = [];
      let batch = [];
      const folders = new Set();

      data = data.filter(datum => datum.key !== '' && !datum.key.includes('images/'))
        .filter(d => {
          const parts = d.key.split('/');

          // hack to get folders
          if (parts.length > 1 && prefix !== `${parts[0]}/`) {
            folders.add(`${parts[0]}/`)
          }

          if (prefix === '') {
            const split = d.key.split('/');
            // if its a top level key, it will not have any '/' or if its a top level folder,
            // it will have an empty string in position 1
            return split.length === 1 || split[1] === '';
          } else if (d.key !== prefix && d.key.includes(prefix)) {
            return true;
          }

          return false;
        }).sort((a, b) => {
          const datumA = a.key.toUpperCase();
          const datumB = b.key.toUpperCase();
          if (datumA < datumB) return -1;
          else if (datumA > datumB) return 1;
          return 0;
        });

      Array.from(folders).sort().forEach(folder => {
        data.unshift({ key: folder, name: folder, type: FOLDER })
      });

      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        const formatted = {
          id: item.key,
          name: item.key,
          type: item.key.endsWith('/') ? FOLDER : FILE,
        };

        batch.push(formatted);

        if (i % columns === columns - 1) {
          items.push(batch);
          batch = [];
        }
      }

      if (batch.length > 0) items.push(batch)

      return resolve(items)
    });
  }

  fetchFromBucket() {
    const { prefix  = '' } = getQueryParams(this.props);
    this.setState({ fetching: true });

    Storage.list(prefix)
      .then(this.createRows)
      .then(items => this.setState({ items, fetching: false }))
      .catch(console.error);
  }

  getItems() {
    const { items: rows, columns } = this.state;
    if (rows.length === 0) return null;

    return rows.map((row, rowIndex) => {
      return (
        <Row key={rowIndex} className="pad-bottom-24">
          { 
            row.map(item => (
              <Col key={item.id} sm={12 / columns}>
                <ArchiveCard
                  key={item.id}
                  item={item}
                  isFile={item.type === FILE}
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
        { this.state.fetching
            ? (<div className="d-flex justify-content-center">
                <Spinner animation="border" role="status" />
              </div>)
            : this.getItems()
        }
      </div>
    )
  }
}

export default Library;