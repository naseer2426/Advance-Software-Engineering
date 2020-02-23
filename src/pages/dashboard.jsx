import React, { Component } from "react";
import { authenticationService } from "../services/authenticationService";
import { userService } from "../services/userService";
import { Card, Button, Row, Col, Container } from "react-bootstrap";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: authenticationService.currentUserValue,
      coursesFromApi: []
    };
  }

  componentDidMount() {
    const { currentUser } = this.state;
    //Gets all the courses registered by the current user depending on the role
    for (var i = 0; i < currentUser.courses.length; i++) {
      userService
        .getByCourse(currentUser.id, currentUser.courses[i])
        .then(coursesFromApi =>
          this.setState(prevState => ({
            coursesFromApi: [...prevState.coursesFromApi, coursesFromApi]
          }))
        );
    }
  }

  render() {
    const { coursesFromApi } = this.state;
    console.log(coursesFromApi);
    return (
      <>
        <h1
          style={{
            "font-family": "Lobster",
            fontSize: "60px",
            textAlign: "center"
          }}
          className="mt-5"
        >
          Your Course Palette
        </h1>
        {coursesFromApi && (
          <Container fluid>
            <Row>
              {coursesFromApi.map(course => (
                <Col sm="6" className="mt-5">
                  <Card>
                    <Card.Img variant="top" src={course.url} />
                    <Card.Body>
                      <Card.Title className="mb-4">{course.name}</Card.Title>
                      <Button variant="info">Load Course</Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Container>
        )}
      </>
    );
  }
}

export default Dashboard;
