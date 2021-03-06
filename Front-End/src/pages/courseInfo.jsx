import React, { Component } from "react";
import {
    Image,
    Col,
    Container,
    Row,
    Card,
    Button,
    Dropdown,
    Form,
    DropdownButton
} from "react-bootstrap";
import "./courseInfoStyle.css";
import { Role } from "../helpers";
import { authenticationService } from "../services/authenticationService";

class CourseInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            courseDescription: this.props.location.state.course,
            currentUser: authenticationService.currentUserValue,
            url: "http://localhost:8000",
            profs: [],
            currProf: "Change Professor",
            LT: "Change Lecture Theatre",
            currLecTim: "Change Lecture Timings",
            students: [],
            studentString: "",
            studentsSelectedName: [],
            studentsDroppedName: [],
            studentDroppedString: "", 
            show: false
        };
        console.log(this.state.currentUser);
    }

    handleClick = dateData => {
        this.props.history.push({
            pathname: "/dateInfo",
            state: { dateData: dateData }
        });
    };

    handleTimeSelect = eventKey => {
        var currLecTim = eventKey;
        this.setState({ currLecTim });
    };
    handleProfChange = eventKey => {
        var profDeets = eventKey.split("~");
        var currProf = profDeets[1];
        var profId = profDeets[0];
        this.setState({ currProf, profId });
    };

    profNameChange = e => {
        this.state({ profName: e.target.value });
    };

    componentDidMount = () => {
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
                            style={{ fontFamily: "Helvetica"}}
                            
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
                        <Dropdown.Item
                            eventKey={currStudent._id + "~" + currStudent.name}
                            style={{ fontFamily: "Helvetica"}}
                        >
                            {currStudent.name}
                        </Dropdown.Item>
                    );
                }

                this.setState({ students: studentInfo });
            });
    };

    handleLTSelect = eventKey => {
        var LT = eventKey;
        this.setState({ LT });
    };

    changeProf = () => {
        var courseId = this.state.courseDescription._id.toString();
        var profId = this.state.profId;

        console.log(courseId, profId);

        fetch(this.state.url + "/change_prof/" + courseId + "/" + profId);
        alert("Succesfully made changes");
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

    handleStudentDelete = eventKey => {
        var studentDeets = eventKey.split("~");
        var studentId = studentDeets[0];
        var studentName = studentDeets[1];

        this.setState((prevState, props) => {
            var studentDroppedString = prevState.studentDroppedString;
            if (studentDroppedString == "") {
                studentDroppedString += studentName;
            } else {
                studentDroppedString += "," + studentName;
            }
            return {
                studentDroppedString
            };
        });
    };

    handleModalShow = e => {
        console.log("Handle modal show triggered");
        // this.setState({ show: true });
        if (this.state.show) {
          this.setState({ show: false });
        } else {
          this.setState({ show: true });
        }
      };

    isAdmin = () => {
        if (this.state.currentUser.role == Role.Administrator &&
            this.state.show == true) {
            return (
                <Container>
                    <Row>
                        {/* Title: Change Course Details */}
                        <Col>
                            <Card className="cardSize" style={{marginTop: "40px"}}>
                                <Card.Header as="h4" className="Header" style={{ fontFamily: "Helvetica", textAlign: "center" }}>
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
                                                    <Form.Label style={{ fontFamily: "Helvetica", textAlign: "center" }}>
                                                        Professor in Charge:
                                                    </Form.Label>
                                                    <DropdownButton
                                                        id="profInCharch"
                                                        title={
                                                            this.state.currProf
                                                        }
                                                        onSelect={
                                                            this
                                                                .handleProfChange
                                                        }
                                                        variant="info"
                                                        style={{fontFamily: "Helvetica"}}
                                                    >
                                                        {this.state.profs}
                                                    </DropdownButton>
                                                </Form.Group>
                                                {/* Lecture Theatre with Dropdown */}
                                                <Form.Group
                                                    as={Col}
                                                    controlId="exampleForm.ControlSelect1"
                                                >
                                                    <Form.Label style={{ fontFamily: "Helvetica", textAlign: "center" }}>
                                                        Lecture Theatre:
                                                    </Form.Label>
                                                    <DropdownButton
                                                        id="timings"
                                                        title={this.state.LT}
                                                        onSelect={
                                                            this.handleLTSelect
                                                        }
                                                        style={{fontFamily: "Helvetica"}}
                                                        variant="info"
                                                    >
                                                        <Dropdown.Item eventKey="LT1">
                                                            LT1
                                                        </Dropdown.Item>
                                                        <Dropdown.Item eventKey="LT2">
                                                            LT2
                                                        </Dropdown.Item>
                                                        <Dropdown.Item eventKey="LT3">
                                                            LT3
                                                        </Dropdown.Item>
                                                        <Dropdown.Item eventKey="LT4">
                                                            LT4
                                                        </Dropdown.Item>
                                                        <Dropdown.Item eventKey="LT5">
                                                            LT5
                                                        </Dropdown.Item>
                                                        <Dropdown.Item eventKey="LT6">
                                                            LT6
                                                        </Dropdown.Item>
                                                        <Dropdown.Item eventKey="LT7">
                                                            LT7
                                                        </Dropdown.Item>
                                                    </DropdownButton>
                                                </Form.Group>
                                            </Form.Row>
                                            {/* New row - Time Slot  */}
                                            <Form.Row>
                                                <Form.Group
                                                    as={Col}
                                                    controlId="exampleForm.ControlSelect1"
                                                >
                                                    <Form.Label style={{ fontFamily: "Helvetica", textAlign: "center" }}>
                                                        Time Slot:
                                                    </Form.Label>
                                                    <DropdownButton
                                                        id="timings"
                                                        title={
                                                            this.state
                                                                .currLecTim
                                                        }
                                                        onSelect={
                                                            this
                                                                .handleTimeSelect
                                                        }
                                                        variant="info"
                                                        style={{ fontFamily: "Helvetica"}}
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
                                            </Form.Row>
                                        </Form>
                                    </Row>
                                    <Row>
                                        <Button
                                            variant="success"
                                            size="sm"
                                            className="Button_Change ml-auto"
                                            onClick={this.changeProf}
                                            style={{ fontFamily: "Helvetica"}}
                                        >
                                            Change
                                        </Button>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                        {/* Title: Change Academic Details */}
                        <Col>
                            <Card className="cardSize" style={{marginTop: "40px"}}>
                                <Card.Header as="h4" className="Header" style={{ fontFamily: "Helvetica", textAlign: "center" }}>
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
                                                    <Form.Label style={{ fontFamily: "Helvetica", textAlign: "center" }}>
                                                        Add Student:
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={
                                                            this.state
                                                                .studentString
                                                        }
                                                    />
                                                </Form.Group>

                                                {/* Drop student form box (1st ROW)*/}
                                                <Form.Group
                                                    as={Col}
                                                    controlId="exampleForm.ControlInput1"
                                                >
                                                    <Form.Label style={{ fontFamily: "Helvetica", textAlign: "center" }}>
                                                        Drop Student:
                                                    </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        value={
                                                            this.state
                                                                .studentDroppedString
                                                        }
                                                    />
                                                </Form.Group>
                                            </Form.Row>
                                            {/* 2nd Row */}
                                            <Form.Row>
                                                {/* Add Professor form box (2nd ROW)*/}
                                                <Form.Group
                                                    as={Col}
                                                    controlId="exampleForm.ControlInput1"
                                                >
                                                    <Form.Label style={{ fontFamily: "Helvetica", textAlign: "center" }}>
                                                        Add Student List
                                                    </Form.Label>
                                                    <DropdownButton
                                                        id="studentsAdded"
                                                        title="Add Student"
                                                        onSelect={
                                                            this
                                                                .handleStudentSelect
                                                        }
                                                        variant="info"
                                                        style={{ fontFamily: "Helvetica"}}
                                                    >
                                                        {this.state.students}
                                                    </DropdownButton>
                                                </Form.Group>
                                                {/* Drop Professor form box (2nd ROW)*/}
                                                <Form.Group
                                                    as={Col}
                                                    controlId="exampleForm.ControlInput1"
                                                >
                                                    <Form.Label style={{ fontFamily: "Helvetica", textAlign: "center" }}>
                                                        Drop Student List:
                                                    </Form.Label>
                                                    <DropdownButton
                                                        id="studentsAdded"
                                                        title="Add Student"
                                                        onSelect={
                                                            this
                                                                .handleStudentDelete
                                                        }
                                                        variant="info"
                                                        style={{ fontFamily: "Helvetica"}}
                                                    >
                                                        {this.state.students}
                                                    </DropdownButton>
                                                </Form.Group>
                                            </Form.Row>
                                        </Form>
                                    </Row>
                                    <Row>
                                        <Button
                                            variant="success"
                                            size="sm"
                                            className="Button_Change ml-auto"
                                            onClick={() => {
                                                alert(
                                                    "Changes made successfully!"
                                                );
                                            }}
                                            style={{ fontFamily: "Helvetica"}}
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
                    {courseDescription.name}
                </h1>
                <Col  className="picture">
                <center>
                <Image 
                        src={courseDescription.url}
                        roundedCircle
                        alt="profile"
                        className="mt-5"
                    />
                </center>
                </Col>
                {this.state.currentUser.role==Role.Administrator && (
                    <Container>
                    <center>
                      <Button
                        variant="warning"
                        onClick={this.handleModalShow}
                        style={{ marginTop: "40px", fontFamily: "Helvetica" }}
                      >
                        Edit Course Information
                      </Button>
                    </center>
                    {this.isAdmin()}
                  </Container>
                )}
                {/* {this.isAdmin()} */}
                {courseDescription && (
                    <Container fluid>
                        <Row>
                            {courseDescription.dates.map((date, index) => (
                                <Col sm="6" className="mt-5" key={index}>
                                    <Card>
                                        <Card.Body>
                                            <Card.Title className="mb-4" style={{ fontFamily: "Helvetica", textAlign: "center" }}>
                                                <b>{date[index]["id"]}</b>
                                            </Card.Title>
                                            <Card.Text style={{ fontFamily: "Helvetica", textAlign: "center" }}>
                                                Total Present:{" "}
                                                {date[index]["Total Present"]}
                                                <br />
                                                Total Absent:{" "}
                                                {date[index]["Total Absent"]}
                                                <br />
                                                Total Students:{" "}
                                                {date[index]["Total Students"]}
                                            </Card.Text>
                                            <Button
                                                variant="info"
                                                size="sm"
                                                onClick={() =>
                                                    this.handleClick(
                                                        date[index]
                                                    )
                                                }
                                                style={{ fontFamily: "Helvetica" }}
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
