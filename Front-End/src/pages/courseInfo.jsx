import React, { Component } from "react";
import {
  Image,
  Col,
  Container,
  Row,
  Card,
  Button,
  Dropdown,
  Form
} from "react-bootstrap";
import "./courseInfoStyle.css";
import { Role } from "../helpers";
import { authenticationService } from "../services/authenticationService";

class CourseInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseDescription: this.props.location.state.course,
      currentUser: authenticationService.currentUserValue
    };
    console.log(this.state.currentUser);
  }

  handleClick = dateData => {
    this.props.history.push({
      pathname: "/dateInfo",
      state: { dateData: dateData }
    });
  };

  profNameChange = e => {
    this.state({ profName: e.target.value });
  };

  isAdmin = () => {
    if (this.state.currentUser.role == Role.Administrator) {
      return (
        <Container>
          <Row>
            {/* Title: Change Course Details */}
            <Col>
              <Card className="cardSize">
                <Card.Header as="h4" className="Header">
                  Change Course Details
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Form className="form">
                      {/* Professor in Charge form box */}
                      <Form.Row>
                        <Form.Group
                          as={Col}
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label>Professor in Charge:</Form.Label>
                          <Form.Control type="text" placeholder="Name" />
                        </Form.Group>
                        {/* Lecture Theatre with Dropdown */}
                        <Form.Group
                          as={Col}
                          controlId="exampleForm.ControlSelect1"
                        >
                          <Form.Label>Lecture Theatre:</Form.Label>
                          <Form.Control as="select">
                            <option>LT1</option>
                            <option>LT2</option>
                            <option>LT3</option>
                            <option>LT4</option>
                            <option>LT5</option>
                          </Form.Control>
                        </Form.Group>
                      </Form.Row>
                      {/* New row - Time Slot  */}
                      <Form.Row>
                        <Form.Group
                          as={Col}
                          controlId="exampleForm.ControlSelect1"
                        >
                          <Form.Label>Time Slot:</Form.Label>
                          <Form.Control as="select">
                            <option>10:30 am - 11:30 am</option>
                            <option>11:30 am - 12:30 am</option>
                            <option>12:30 am - 1:30 pm</option>
                            <option>1:30 pm - 2:30 pm</option>
                            <option>2:30 pm - 3:30 pm</option>
                          </Form.Control>
                        </Form.Group>
                      </Form.Row>
                    </Form>
                  </Row>
                  <Row>
                    <Button
                      variant="info"
                      size="sm"
                      className="Button_Change ml-auto"
                    >
                      Change
                    </Button>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            {/* Title: Change Academic Details */}
            <Col>
              <Card className="cardSize">
                <Card.Header as="h4" className="Header">
                  Change Academic Details
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Form className="form">
                      {/*1st ROW*/}
                      <Form.Row>
                        {/* Add student form box (1st ROW)*/}
                        <Form.Group
                          as={Col}
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label>Add Student:</Form.Label>
                          <Form.Control type="text" placeholder="Name" />
                        </Form.Group>

                        {/* Drop student form box (1st ROW)*/}
                        <Form.Group
                          as={Col}
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label>Drop Student:</Form.Label>
                          <Form.Control type="text" placeholder="Name" />
                        </Form.Group>
                      </Form.Row>
                      {/* 2nd Row */}
                      <Form.Row>
                        {/* Add Professor form box (2nd ROW)*/}
                        <Form.Group
                          as={Col}
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label>Add Professor:</Form.Label>
                          <Form.Control type="text" placeholder="Name" />
                        </Form.Group>
                        {/* Drop Professor form box (2nd ROW)*/}
                        <Form.Group
                          as={Col}
                          controlId="exampleForm.ControlInput1"
                        >
                          <Form.Label>Drop Professor:</Form.Label>
                          <Form.Control type="text" placeholder="Name" />
                        </Form.Group>
                      </Form.Row>
                    </Form>
                  </Row>
                  <Row>
                    <Button
                      variant="info"
                      size="sm"
                      className="Button_Change ml-auto"
                    >
                      Change
                    </Button>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      );
    }
  };

  render() {
    const { courseDescription } = this.state;
    // console.log(courseDescription.dates);
    return (
      <>
        <h1
          style={{
            fontFamily: "Lora",
            fontSize: "60px",
            textAlign: "center",
            fontWeight: "bold"
          }}
          className="mt-5"
        >
          {courseDescription.name}
        </h1>
        <Col md={{ span: 6, offset: 3 }} className="picture">
          <Image
            src={courseDescription.url}
            roundedCircle
            alt="profile"
            className="mt-5"
          />
        </Col>
        {this.isAdmin()}
        {courseDescription && (
          <Container fluid>
            <Row>
              {courseDescription.dates.map((date, index) => (
                <Col sm="6" className="mt-5" key={index}>
                  <Card>
                    <Card.Body>
                      <Card.Title className="mb-4">
                        {date[index]["id"]}
                      </Card.Title>
                      <Card.Text>
                        Total Present: {date[index]["Total Present"]}
                        <br />
                        Total Absent: {date[index]["Total Absent"]}
                        <br />
                        Total Students: {date[index]["Total Students"]}
                      </Card.Text>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => this.handleClick(date[index])}
                      >
                        View
                      </Button>
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

export default CourseInfo;
