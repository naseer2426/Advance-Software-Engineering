import React, { Component } from "react";
import { Image, Col, Container, Row, Card, Button } from "react-bootstrap";

class CourseInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseDescription: this.props.location.state.course
    };
  }

  handleClick = dateData => {
    this.props.history.push({
      pathname: "/dateInfo",
      state: { dateData: dateData }
    });
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
        <Col md={{ span: 6, offset: 3 }}>
          <Image
            src={courseDescription.url}
            roundedCircle
            alt="profile"
            className="mt-5"
          />
        </Col>
        <Col Container className="mt-5">
          <div class="card">
            <h2 class="card-header">Edit Course Details</h2>
            <div class="card-body">
              <row class="card-text">
                Lecture Theatre:
                <dropdown>
                  <button
                    class="btn btn-outline-secondary btn-sm dropdown-toggle m-3"
                    type="button"
                    id="dropdownMenu2"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    LT1
                  </button>
                </dropdown>
                <Button
                  variant="info"
                  size="sm"
                  //onClick={() => this.handleClick(course)}
                >
                  Change
                </Button>
              </row>
              <row class="card-text">Professor in Charge:</row>
              <row class="card-text">Time Slot:</row>
              <row class="card-text">Time Slot:</row>
            </div>
          </div>
        </Col>
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
