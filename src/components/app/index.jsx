import React from 'react';
import { Button } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';

import './style.scss';

class App extends React.Component {
  render() {
    return (
      <div className="App" >
        <Button primary>Primary</Button>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
