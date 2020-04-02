import React from "react";
import { userService } from "../services/userService";
import { MDBRow } from "mdbreact";
import {
  Card,
  Row,
  Col,
  Container,
  Button,
  Form,
  Dropdown,
  DropdownButton
} from "react-bootstrap";

class AdminPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      users: null,
      show: false,
      userName: null,
      firstName: null,
      lastName: null,
      networkId: null,
      password: null
    };
  }

  addUser = () => {
    var body = {
      userName: this.state.userName,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      networkId: this.state.networkId,
      password: this.state.password
    };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    };
    fetch(this.state.url + "/add_user", requestOptions);
    alert("New User " + this.state.userName + " added");
  };

  componentDidMount() {
    userService.getAll().then(users => this.setState({ users }));
  }

  handleModalShow = e => {
    console.log("Handle modal show triggered");
    // this.setState({ show: true });
    if (this.state.show) {
      this.setState({ show: false });
    } else {
      this.setState({ show: true });
    }
  };

  handleUserName = e => {
    var userName = e.target.value;
    this.setState({ userName });
  };

  handleFirstName = e => {
    var firstName = e.target.value;
    this.setState({ firstName });
  };

  handleLastName = e => {
    var lastName = e.target.value;
    this.setState({ lastName });
  };

  handleNetworkId = e => {
    var networkId = e.target.value;
    this.setState({ networkId });
  };

  handlePassword = e => {
    var password = e.target.value;
    this.setState({ password });
  };

  isAdmin = () => {
    if (this.state.show == true) {
      console.log("In admin");
      return (
        <Card style={{ marginTop: "50px" }}>
          <Card.Header
            as="h4"
            style={{
              fontFamily: "Helvetica",
              textAlign: "center"
            }}
          >
            Add User profile
          </Card.Header>
          <Card.Body>
            <Container>
              <Form>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label
                    style={{ fontFamily: "Helvetica", textAlign: "center" }}
                  >
                    User Name:
                  </Form.Label>
                  <Form.Control type="text" onChange={this.handleUserName} />
                  <Form.Label
                    style={{ fontFamily: "Helvetica", textAlign: "center" }}
                  >
                    First Name:
                  </Form.Label>
                  <Form.Control type="text" onChange={this.handleFirstName} />
                  <Form.Label
                    style={{ fontFamily: "Helvetica", textAlign: "center" }}
                  >
                    Last Name:
                  </Form.Label>
                  <Form.Control type="text" onChange={this.handleLastName} />
                  <Form.Label
                    style={{ fontFamily: "Helvetica", textAlign: "center" }}
                  >
                    Network Id:
                  </Form.Label>
                  <Form.Control type="text" onChange={this.handleNetworkId} />
                  <Form.Label
                    style={{ fontFamily: "Helvetica", textAlign: "center" }}
                  >
                    Password:
                  </Form.Label>
                  <Form.Control
                    type="Password"
                    onChange={this.handlePassword}
                  />
                </Form.Group>
              </Form>
              <Row>
                <Button
                  variant="success"
                  size="md"
                  className="Button_Change ml-auto"
                  onClick={this.addUser}
                  style={{ width: "9rem", fontFamily: "Helvetica" }}
                >
                  Add
                </Button>
              </Row>
            </Container>
          </Card.Body>
        </Card>
      );
    }
  };

  render() {
    const { users } = this.state;
    return (
      <div>
        <h1
          style={{
            fontFamily: "Lobster",
            fontSize: "60px",
            textAlign: "center"
          }}
          className="mt-5"
        >
          Community Page
        </h1>
        <p style={{ fontFamily: "Helvetica", textAlign: "center" }}>
          -----This page can only be accessed by administrators-----
        </p>
        <MDBRow center>
          {users && (
            <Container fluid>
              <Row className="justify-content-center">
                <Button
                  variant="warning"
                  onClick={this.handleModalShow}
                  style={{ fontFamily: "Helvetica", marginTop: "20px" }}
                >
                  Add User
                </Button>
                <Container>{this.isAdmin()}</Container>
              </Row>
              <Row>
                {users.map((user, index) => (
                  <Col sm="6" className="mt-5" key={index}>
                    <Card>
                      <Card.Img variant="top" src={user.profileUrl} />
                      <Card.Body>
                        <Card.Title
                          className="mb-4"
                          style={{
                            fontFamily: "Helvetica",
                            textAlign: "center"
                          }}
                        >
                          {user.firstName} {user.lastName}
                        </Card.Title>
                        <Card.Subtitle
                          className="mb-2 text-muted"
                          style={{
                            fontFamily: "Helvetica",
                            textAlign: "center"
                          }}
                        >
                          {user.role}
                        </Card.Subtitle>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Container>
          )}
        </MDBRow>
      </div>
    );
  }
}

export default AdminPage;
