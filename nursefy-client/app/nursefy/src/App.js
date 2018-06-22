
import React, { Component } from 'react'
import { BrowserRouter, Switch, Route,withRouter } from 'react-router-dom'
import { Landing, Login, Register, Home, HomeAdmin } from './components'
import './App.css';
import logic from './logic'

logic.init()



class App extends Component {

  logOut = () => {
        localStorage.clear()
        this.props.history.push("/")
  }

  render() {
    return (

      <div>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route path="/home" render={(props) => <Home {...props} logOut={this.logOut}/>} />
            <Route path="/home-admin" render={() => <HomeAdmin logOut={this.logOut} />} />
          </Switch>
        </BrowserRouter>
      </div>

    );
  }
}

export default App;
