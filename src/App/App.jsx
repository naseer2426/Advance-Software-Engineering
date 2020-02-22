import React from "react";
import "../App.css";
import { Router, Route, Link } from "react-router-dom";
import { history } from "../helpers/history";
import { Role } from "../helpers/role";
import { authenticationService } from "../services/authenticationService";
import PrivateRoute from "../components/privateRoute";

//Pages
// import Dashboard from "../components/dashboard";
// import SignInPage from "../pages/signInPage";
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
          {currentUser && (
            <nav className="navbar navbar-expand navbar-dark bg-dark">
              <div className="navbar-nav">
                <Link to="/" className="nav-item nav-link">
                  Home
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="nav-item nav-link">
                    Admin
                  </Link>
                )}
                <button onClick={this.logout} className="nav-item nav-link">
                  Logout
                </button>
              </div>
            </nav>
          )}
          <div className="jumbotron">
            <div className="container">
              <div className="row">
                <div className="col-md-6 offset-md-3">
                  <PrivateRoute exact path="/" component={HomePage} />
                  <PrivateRoute
                    path="/admin"
                    roles={[Role.Admin]}
                    component={AdminPage}
                  />
                  <Route path="/signin" component={LoginPage} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Router>
    );
  }
}

export { App };

// function App() {
//   function loggedIn() {
//     return false;
//   }

//   return (
//     <React.Fragment>
//       <NavBar />
//       <Router>
//         <Route path="/signin" component={SignInPage} />
//         <PrivateRoute authed={loggedIn()} path="/home" component={Dashboard} />
//         <PrivateRoute
//           authed={loggedIn()}
//           path="/dashboard"
//           component={Dashboard}
//         />
//       </Router>
//     </React.Fragment>
//   );
// }
