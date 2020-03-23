import React, { Component } from "react";
import ArchiveCard from "./ArchiveCard";

class Library extends Component {
  state = {
    show: false,
    showing: -1,
  };

  handleHide = () => this.setState({ show: false });

  getItems() {
    const items = [];
    for (let i = 0; i < 9; i++) {
      items.push(
        <ArchiveCard
          key={i}
          index={i}
          title={`Item ${i + 1}`}
          subtext="Subtitle"
        />
      )
    }

    return items;
  }

  render() {
    return (
      <div className="library">
        { this.getItems() }
      </div>
    )
  }
}

export default Library