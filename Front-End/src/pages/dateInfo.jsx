import React, { Component } from "react";
import { Col, Row, Card } from "react-bootstrap";

class DateInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dateData: this.props.location.state.dateData
    };
  }

  render() {
    const { dateData } = this.state;
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
          Students Gallore
        </h1>
        {dateData && (
          <Row>
            {dateData.Students.Present.map((studentP, index) => (
              <Col sm="4" className="mt-5" key={index}>
                <Card>
                  <Card.Img variant="top" src={studentP.url} />
                  <Card.Body>
                    <Card.Title className="mb-4">{studentP.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Present
                    </Card.Subtitle>
                  </Card.Body>
                </Card>
              </Col>
            ))}
            {dateData.Students.Absent.map((studentA, index) => (
              <Col sm="4" className="mt-5" key={index}>
                <Card>
                  <Card.Img variant="top" src={studentA.url} />
                  <Card.Body>
                    <Card.Title className="mb-4">{studentA.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      Absent
                    </Card.Subtitle>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </>
    );
  }
}

export default DateInfo;
