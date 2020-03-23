import React, { Component } from "react";
import {Document, Page} from "react-pdf/dist/entry.webpack";

class PDFPreview extends Component {
  state = {
    numPages: null,
    pageNumber: 1,
  };

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };

  onDocumentLoadError = err => {
    console.error('error loading pdf from url', this.props.url, err);
  };

  render() {
    return (
      <div>
        <Document
          file={this.props.url}
          renderMode="svg"
          onLoadSuccess={this.onDocumentLoadSuccess}
          onLoadError={this.onDocumentLoadError}
        >
          <Page width={200} renderMode="svg" pageNumber={this.state.pageNumber} />
        </Document>
      </div>
    )
  }
}

export default PDFPreview;