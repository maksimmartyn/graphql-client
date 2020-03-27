import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Header from './Header';
import LinksList from './LinksList';
import CreateLink from './CreateLink';
import Login from './Auth/Login';
import Search from './Search';

function App() {
  return (
    <div className="center w85">
        <Header />
        
        <div className="ph3 pv1 background-gray">
            <Switch>
                <Route exact path="/" component={LinksList} />
                <Route exact path="/create" component={CreateLink} />
                <Route exact path="/login" component={Login} />
                <Route exact path='/search' component={Search} />
            </Switch>
        </div>
  </div>
  )
}

export default App;
