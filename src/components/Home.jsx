import React, { PureComponent } from 'react';
import Container from 'react-bootstrap/Container'
import Jumbotron from 'react-bootstrap/Jumbotron';

import Library from './library';
import Header from './Header';
import { navigate } from '@reach/router';

class Home extends PureComponent {
  goBack = () => navigate(-1);

  render() {
    const { location } = this.props;
    const leftButton = location.search === '' ? null : { onClick: () => navigate('/'), title: "Back" }

    return (
      <Container>
        <Header leftButton={ leftButton } />
        <Jumbotron>
          <h1 className="jumbotron-title">Welcome to the Archives!</h1>
          <p>
            Over the course of the past four years, we have painstakingly digitized every issue ever published by the South American Explorers.
            All archives are free to read on or offline.
            We hope you enjoy browsing them as much as we enjoyed writing them over these years
          </p>
        </Jumbotron>
        <Library location={location} />
      </Container>
    )
  }
}

export default Home
