import React from "react";
import "../App.css";
import { Router, Route } from "react-router-dom";
import { history } from "../helpers/history";
import { Role } from "../helpers/role";
import { authenticationService } from "../services/authenticationService";
import PrivateRoute from "../components/privateRoute";
import { Navbar, Nav } from "react-bootstrap";

import Dashboard from "../pages/dashboard";
import HomePage from "../pages/homePage";
import AdminPage from "../pages/adminPage";
import LoginPage from "../pages/loginPage";
import CourseInfo from "../pages/courseInfo";
import DateInfo from "../pages/dateInfo";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
      isAdmin: false
    };
  }

  componentDidMount() {
    authenticationService.currentUser.subscribe(x =>
      this.setState({
        currentUser: x,
        isAdmin: x && x.role === Role.Administrator
      })
    );
  }

  logout() {
    authenticationService.logout();
    history.push("/signin");
  }

  render() {
    const { currentUser, isAdmin } = this.state;
    return (
      <Router history={history}>
        <div>
          <Navbar bg="dark" variant="dark">
            <Navbar.Brand href="/signin">FRATS</Navbar.Brand>
            <Nav className="ml-auto">
              {currentUser && (
                <>
                  <Nav.Link href="/" className="nav-item nav-link mr-3">
                    Home
                  </Nav.Link>
                  <Nav.Link
                    href="/dashboard"
                    className="nav-item nav-link mr-3"
                  >
                    Dashboard
                  </Nav.Link>
                  {isAdmin && (
                    <Nav.Link href="/manage" className="nav-item nav-link mr-3">
                      Manage
                    </Nav.Link>
                  )}
                  <button
                    onClick={this.logout}
                    type="button"
                    className="btn btn-info"
                  >
                    Logout
                  </button>
                </>
              )}
            </Nav>
          </Navbar>
          <div className="container">
            <div className="row">
              <div className="col-md-6 offset-md-3">
                <PrivateRoute exact path="/" component={HomePage} />
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <PrivateRoute
                  exact
                  path="/manage"
                  roles={[Role.Administrator]}
                  component={AdminPage}
                />
                <PrivateRoute exact path="/courseInfo" component={CourseInfo} />
                <PrivateRoute exact path="/dateInfo" component={DateInfo} />
                <Route path="/signin" component={LoginPage} />
              </div>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export { App };
