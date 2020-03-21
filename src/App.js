import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { GlobalStyles } from './styles'
import SearchDeliveryLocation from './pages/SearchDeliveryLocation'

const App = () => (
  <React.Fragment>
    <GlobalStyles />
    <Switch>
      <Route exact path='/search-delivery-location/:address?' component={SearchDeliveryLocation} />
      <Redirect to='/search-delivery-location' />
    </Switch>
  </React.Fragment>
);

export default App