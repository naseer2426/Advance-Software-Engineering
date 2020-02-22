import React from "react";
import "../App.css";
import { Router, Route } from "react-router-dom";
import { history } from "../helpers/history";
import { Role } from "../helpers/role";
import { authenticationService } from "../services/authenticationService";
import PrivateRoute from "../components/privateRoute";
import { Navbar, Nav } from "react-bootstrap";

//Pages
// import SignInPage from "../pages/signInPage";
import Dashboard from "../components/dashboard";
import HomePage from "../pages/homePage";
import AdminPage from "../pages/adminPage";
import LoginPage from "../pages/loginPage";

// import NavBar from "../components/navbar";

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
        isAdmin: x && x.role === Role.Admin
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
                  <Nav.Link href="/" className="nav-item nav-link mr-4">
                    Home
                  </Nav.Link>
                  <Nav.Link
                    href="/dashboard"
                    className="nav-item nav-link mr-4"
                  >
                    Dashboard
                  </Nav.Link>
                  {isAdmin && (
                    <Nav.Link href="/manage" className="nav-item nav-link mr-4">
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
          <div className="container mt-5">
            <div className="row">
              <div className="col-md-6 offset-md-3">
                <PrivateRoute exact path="/" component={HomePage} />
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <PrivateRoute
                  path="/manage"
                  roles={[Role.Admin]}
                  component={AdminPage}
                />
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
