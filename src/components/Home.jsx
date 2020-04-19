import React, { PureComponent } from 'react';
import Container from 'react-bootstrap/Container'
import Jumbotron from 'react-bootstrap/Jumbotron';

import Library from './library';
import Header from './Header';
import { navigate } from '@reach/router';

import { getQueryParams } from './utils'
console.log('getQueryParams', getQueryParams);

const defaultJumbotron = () => ({
  style: {
    backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3) ), url('./machu-hero.jpg')`,
    backgroundSize: 'cover',
    color: 'white',
    boxShadow: '4px 4px 18px rgba(0,0,0,0.1)',
    marginTop: '12px',
  },
  title: "Welcome to the Archives!",
  subtitle: "Over the course of the past four years, we have painstakingly digitized every issue ever published by the South American Explorers. All archives are free to read on or offline. We hope you enjoy browsing them as much as we enjoyed writing them over these years.",
  leftButton: null
});

const folderJumbotron = title => ({
  style: {
    marginTop: '12px',
    boxShadow: '4px 4px 18px rgba(0, 0, 0, 0.1)',
  },
  title: `Archives from ${title}`,
  leftButton: { onClick: () => navigate('/'), title: "Back" },
});

class Home extends PureComponent {
  render() {
    const { location } = this.props;
    let jumbotron;

    if (location.search === '') {
      jumbotron = defaultJumbotron();
    } else {
      const qp = getQueryParams(this.props);
      jumbotron = folderJumbotron(qp.prefix.split('/')[0]);
    }

    return (
      <Container>
        <Header leftButton={jumbotron.leftButton} />
        <Jumbotron style={jumbotron.style} >
          <h1 className="jumbotron-title">{jumbotron.title}</h1>
          { jumbotron.subtitle ? <p>{jumbotron.subtitle}</p> : null }
        </Jumbotron>
        <Library location={location} />
      </Container>
    )
  }
}

export default Home
