import React from "react";
import { userService } from "../services/userService";
import { MDBRow } from "mdbreact";
import { Card, Row, Col, Container, Button } from "react-bootstrap";

class AdminPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            users: null
        };
    }

    componentDidMount() {
        userService.getAll().then(users => this.setState({ users }));
    }

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
                <p style={{ textAlign: "center" }}>
                    -----This page can only be accessed by administrators-----
                </p>
                <MDBRow center>
                    {users && (
                        <Container fluid>
                            <Row className="justify-content-center">
                                <Button variant="success">Add User</Button>
                            </Row>
                            <Row>
                                {users.map((user, index) => (
                                    <Col sm="6" className="mt-5" key={index}>
                                        <Card>
                                            <Card.Img
                                                variant="top"
                                                src={user.profileUrl}
                                            />
                                            <Card.Body>
                                                <Card.Title className="mb-4">
                                                    {user.firstName}{" "}
                                                    {user.lastName}
                                                </Card.Title>
                                                <Card.Subtitle className="mb-2 text-muted">
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
