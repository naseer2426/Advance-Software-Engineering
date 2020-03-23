import React, { Component } from "react";
import { userService } from "../services/userService";
import {
  Card,
  Button,
  Row,
  Col,
  Container,
  Form,
  Dropdown,
  DropdownButton
} from "react-bootstrap";
import { Role } from "../helpers";
import { authenticationService } from "../services/authenticationService";

class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentUser: authenticationService.currentUserValue,
      coursesFromApi: [],
      profs: [],
      url: "http://localhost:8000",
      students: [],
      currProf: "Add Professors:",
      profId: null,
      currLecTim: "Add timings:",
      studentsSelectedName: [],
      studentsSelectedId: [],
      studentString: "",
      LT: "Lecture Theatre",
      courseName: ""
    };
  }

  makeCourse = () => {
    var body = { name: this.state.courseName, profId: this.state.profId };
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    };
    fetch(this.state.url + "/make_course", requestOptions);
    alert("New Course " + this.state.courseName + " added");
  };

  handleClick = course => {
    this.props.history.push({
      pathname: "/courseInfo",
      state: { course: course }
    });
  };

  handleLTSelect = eventKey => {
    var LT = eventKey;
    this.setState({ LT });
  };

  componentDidMount() {
    const { currentUser } = this.state;

    //Gets all the courses registered by the current user depending on the role
    for (var i = 0; i < currentUser.courses.length; i++) {
      userService
        .getByCourse(currentUser["_id"], currentUser.courses[i])
        .then(coursesFromApi =>
          this.setState(prevState => ({
            coursesFromApi: [...prevState.coursesFromApi, coursesFromApi]
          }))
        );
    }

    fetch(this.state.url + "/professors")
      .then(res => {
        console.log("test");
        return res.json();
      })
      .then(profs => {
        console.log(profs);
        var profList = [];

        for (var i = 0; i < profs.length; i++) {
          var currProf = profs[i];
          profList.push(
            <Dropdown.Item
              eventKey={
                currProf._id +
                "~" +
                currProf.firstName +
                " " +
                currProf.lastName
              }
            >
              {currProf.firstName + " " + currProf.lastName}
            </Dropdown.Item>
          );
        }

        this.setState({ profs: profList });
      });

    fetch(this.state.url + "/students")
      .then(res => {
        return res.json();
      })
      .then(students => {
        var studentInfo = [];

        for (var i = 0; i < students.length; i++) {
          var currStudent = students[i];
          studentInfo.push(
            <Dropdown.Item eventKey={currStudent._id + "~" + currStudent.name}>
              {currStudent.name}
            </Dropdown.Item>
          );
        }

        this.setState({ students: studentInfo });
      });
  }
  handleProfChange = eventKey => {
    var profDeets = eventKey.split("~");
    var currProf = profDeets[1];
    var profId = profDeets[0];
    this.setState({ currProf, profId });
  };

  handleStudentSelect = eventKey => {
    var studentDeets = eventKey.split("~");
    var studentId = studentDeets[0];
    var studentName = studentDeets[1];

    this.setState((prevState, props) => {
      var studentString = prevState.studentString;
      if (studentString == "") {
        studentString += studentName;
      } else {
        studentString += "," + studentName;
      }
      return {
        studentString
      };
    });

    // this.getAddedStudents();

    // console.log(this.state.studentsSelectedName);
  };

  // getAddedStudents = () => {
  //     var studentsSelectedName = this.state.studentsSelectedName;

  //     var studentString = "";

  //     for (var i = 0; studentsSelectedName.length; i++) {
  //         studentString += studentsSelectedName[i];
  //         console.log(studentsSelectedName[i]);
  //         if (i != studentsSelectedName.length - 1) {
  //             studentString += ",";
  //         }
  //     }
  //     this.setState({ studentString });
  // };
  handleTimeSelect = eventKey => {
    var currLecTim = eventKey;
    this.setState({ currLecTim });
  };

  handleNameChange = e => {
    var courseName = e.target.value;
    this.setState({ courseName });
  };
  isAdmin = () => {
    if (this.state.currentUser.role == Role.Administrator) {
      return (
        <Card style={{ marginTop: "50px" }}>
          <Card.Header
            as="h4"
            style={{
              fontFamily: "Montserrat",
              textAlign: "center"
            }}
          >
            Create Course
          </Card.Header>
          <Card.Body>
            <Container>
              <Form>
                <Form.Group controlId="exampleForm.ControlInput1">
                  <Form.Label
                    style={{ fontFamily: "Montserrat", textAlign: "center" }}
                  >
                    Course Name:
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="E.g. Software Engineering"
                    onChange={this.handleNameChange}
                  />
                </Form.Group>

                <Row>
                  <Col>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                      <Form.Label
                        style={{
                          fontFamily: "Montserrat",
                          textAlign: "center"
                        }}
                      >
                        Add Professor
                      </Form.Label>
                      {/* <Form.Control as="textarea" rows="3" /> */}
                      <DropdownButton
                        id="profInCharge"
                        title={this.state.currProf}
                        onSelect={this.handleProfChange}
                        variant="info"
                      >
                        {this.state.profs}
                      </DropdownButton>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Label
                      style={{
                        fontFamily: "Montserrat",
                        textAlign: "center"
                      }}
                    >
                      Student List
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={this.state.studentString}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                      <Form.Label
                        style={{
                          fontFamily: "Montserrat",
                          textAlign: "center"
                        }}
                      >
                        Lecture timings
                      </Form.Label>
                      <DropdownButton
                        id="timings"
                        title={this.state.currLecTim}
                        onSelect={this.handleTimeSelect}
                        variant="info"
                      >
                        <Dropdown.Item eventKey="9:30-11:30">
                          9:30-11:30
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="11:30-1:30">
                          11:30-1:30
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="1:30-3:30">
                          1:30-3:30
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="3:30-5:30">
                          3:30-5:30
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="5:30-7:30">
                          5:30-7:30
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="7:30-9:30">
                          7:30-9:30
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="9:30-11:30">
                          9:30-11:30
                        </Dropdown.Item>
                      </DropdownButton>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                      <Form.Label
                        style={{
                          fontFamily: "Montserrat",
                          textAlign: "center"
                        }}
                      >
                        Add students:
                      </Form.Label>
                      <DropdownButton
                        id="studentsAdded"
                        title="Add Student"
                        onSelect={this.handleStudentSelect}
                        variant="info"
                      >
                        {this.state.students}
                      </DropdownButton>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
              <Row>
                <Col>
                  <Form.Label
                    style={{
                      fontFamily: "Montserrat",
                      textAlign: "center"
                    }}
                  >
                    Add LT:
                  </Form.Label>
                  <DropdownButton
                    id="timings"
                    title={this.state.LT}
                    onSelect={this.handleLTSelect}
                    variant="info"
                  >
                    <Dropdown.Item eventKey="LT1">LT1</Dropdown.Item>
                    <Dropdown.Item eventKey="LT2">LT2</Dropdown.Item>
                    <Dropdown.Item eventKey="LT3">LT3</Dropdown.Item>
                    <Dropdown.Item eventKey="LT4">LT4</Dropdown.Item>
                    <Dropdown.Item eventKey="LT5">LT5</Dropdown.Item>
                    <Dropdown.Item eventKey="LT6">LT6</Dropdown.Item>
                    <Dropdown.Item eventKey="LT7">LT7</Dropdown.Item>
                  </DropdownButton>
                </Col>
                <Col></Col>
              </Row>
              <Row>
                <Button
                  variant="warning"
                  size="md"
                  className="Button_Change ml-auto"
                  onClick={this.makeCourse}
                  style={{ width: "9rem" }}
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
    const { coursesFromApi } = this.state;
    // console.log(coursesFromApi);
    return (
      <>
        <h1
          style={{
            fontFamily: "Lobster",
            fontSize: "60px",
            textAlign: "center"
          }}
          className="mt-5"
        >
          Your Course Palette
        </h1>
        <Container>{this.isAdmin()}</Container>
        {coursesFromApi && (
          <Container fluid style={{ marginTop: "30px" }}>
            <Row>
              {coursesFromApi.map(course => (
                <Col sm="6" className="mt-5" key={course.id}>
                  <Card>
                    <Card.Img variant="top" src={course.url} />
                    <Card.Body>
                      <Card.Title
                        className="mb-4"
                        style={{
                          fontFamily: "Montserrat",
                          textAlign: "center"
                        }}
                      >
                        {course.name}
                      </Card.Title>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => this.handleClick(course)}
                      >
                        Select
                      </Button>
                      <Button className="btn btn-danger btn-sm m-2">
                        Delete
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

export default Dashboard;
