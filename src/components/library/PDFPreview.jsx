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

  render() {
    return (
      <div>
        <Document file="./sae-mag-34g-sinking-village-assignment.pdf" onLoadSuccess={this.onDocumentLoadSuccess}>
          <Page width={this.props.width || null} pageNumber={this.state.pageNumber} />
        </Document>
      </div>
    )
  }
}

export default PDFPreview;