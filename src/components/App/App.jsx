import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Catalog from '../Catalog';

import './App.css';

class App extends React.Component {

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route
              path="/catalog/:id?"
              exact
              render={props => (
                <Catalog
                  {...props}
                />
              )}
            />
            <Redirect to="/catalog/" />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
