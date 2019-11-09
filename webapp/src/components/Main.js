import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import Home from './Home';

const Main = () => {
  return(
    <BrowserRouter>
      <div>
        <Route exact={true} path="/" component={Home} />
      </div>
    </BrowserRouter>
  );
};

export default Main;
