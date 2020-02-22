import React, { Component } from "react";
import { Row, Container } from "react-bootstrap";
import SignInForm from "../components/signIn";
import { authenticationService } from "../services/authenticationService";
//Can remove
class SignInPage extends React.Component {
  constructor(props) {
    super(props);

    // redirect to home if already logged in
    if (authenticationService.currentUserValue) {
      this.props.history.push("/");
    }
  }

  render() {
    return (
      <React.Fragment>
        <Container>
          <Row className="justify-content-md-center mt-5 container-fluid">
            <SignInForm />
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}

export default SignInPage;
