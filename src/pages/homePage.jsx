import React from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import { Container, Col, Image } from "react-bootstrap";

import { authenticationService } from "../services/authenticationService";
// import { userService } from "../services/userService";

class HomePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: authenticationService.currentUserValue,
      userFromApi: null
    };
  }

  render() {
    const { currentUser } = this.state;
    return (
      <React.Fragment>
        <Container fluid md={12}>
          <Col md={{ span: 6, offset: 3 }}>
            <Image src={currentUser.profileUrl} roundedCircle alt="profile" />
          </Col>
        </Container>
        <Jumbotron>
          <Container>
            <h1 className="text-center">
              Welcome{" "}
              <strong>
                <i>{currentUser.firstName}</i>
              </strong>
            </h1>
          </Container>
        </Jumbotron>
        <Col>
          <p>
            Your role is: <strong>{currentUser.role}</strong>
          </p>
        </Col>
      </React.Fragment>
    );
  }
}

export default HomePage;
