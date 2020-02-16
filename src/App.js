import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";

import Dashboard from "./components/dashboard";
import SignInPage from "./pages/signInPage";
import PrivateRoute from "./components/privateRoute";
import NavBar from "./components/navbar";

function App() {
  function loggedIn() {
    return false;
  }

  return (
    <React.Fragment>
      <NavBar />
      <Router>
        <Route path="/signin" component={SignInPage} />
        <PrivateRoute authed={loggedIn()} path="/home" component={Dashboard} />
        <PrivateRoute
          authed={loggedIn()}
          path="/dashboard"
          component={Dashboard}
        />
      </Router>
    </React.Fragment>
  );
}

export default App;
