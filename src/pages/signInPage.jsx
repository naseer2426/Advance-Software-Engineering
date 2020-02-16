import React, { Component } from "react";
import { Row, Container } from "react-bootstrap";

import SignInForm from "../components/signIn";

class SignInPage extends Component {
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
