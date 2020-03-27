import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

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
                <Route exact path='/' render={() => <Redirect to='/new/1' />} />
                <Route exact path="/create" component={CreateLink} />
                <Route exact path="/login" component={Login} />
                <Route exact path='/search' component={Search} />
                <Route exact path='/top' component={LinksList} />
                <Route exact path='/new/:page' component={LinksList} />
            </Switch>
        </div>
  </div>
  )
}

export default App;
