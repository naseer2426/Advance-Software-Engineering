import React, { Component } from "react";
import { Navbar, Nav } from "react-bootstrap";

class NavBar extends Component {
  state = {
    navLinks: [
      { name: "Home", route: "/home" },
      { name: "Dashboard", route: "/dashboard" }
    ]
  };
  render() {
    return (
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/home">FRATS</Navbar.Brand>
        <Nav className="ml-auto">
          {this.state.navLinks.map((navLink, key) => (
            <Nav.Link href={navLink.route} key={key}>
              {navLink.name}
            </Nav.Link>
          ))}
        </Nav>
      </Navbar>
    );
  }
}

export default NavBar;
