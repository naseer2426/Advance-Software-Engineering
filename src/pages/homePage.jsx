import React from "react";
import Jumbotron from "react-bootstrap/Jumbotron";
import { Container, Col, Row, Image } from "react-bootstrap";
import { Button } from "react-bootstrap";
import Webcam from "react-webcam";
import { authenticationService } from "../services/authenticationService";
import { Role } from "../helpers";

class HomePage extends React.Component {
  enableWebcam = () => this.setState({ webcamEnabled: true });

  constructor(props) {
    super(props);
    this.state = {
      currentUser: authenticationService.currentUserValue,
      userFromApi: null,
      webcamEnabled: false
    };
  }

  render() {
    const { currentUser } = this.state;
    return (
      <React.Fragment>
        {this.state.webcamEnabled ? (
          <Row className="justify-content-center">
            <Webcam />
          </Row>
        ) : (
          <>
            <Container fluid md={12}>
              <Col md={{ span: 6, offset: 3 }}>
                <Image
                  src={currentUser.profileUrl}
                  roundedCircle
                  alt="profile"
                  className="mt-5"
                />
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
            {currentUser.role === Role.Professor && (
              <Row className="justify-content-center mt-5">
                <Button variant="warning" onClick={this.enableWebcam}>
                  Start my session
                </Button>
              </Row>
            )}
          </>
        )}
      </React.Fragment>
    );
  }
}

export default HomePage;
