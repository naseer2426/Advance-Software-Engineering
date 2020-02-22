import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
//Can Remove
class SignInForm extends Component {
  render() {
    return (
      <Form>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Enter your NTU email</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
          <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text>
        </Form.Group>

        <Form.Group controlId="formBasicDomain">
          <select id="domain" ref={input => (this.menu = input)} required>
            <option value="Student">Student</option>
            <option value="Professor">Professor</option>
            <option value="Administrator">Administrator</option>
          </select>
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <div className="row justify-content-sm-center container-fluid">
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
      </Form>
    );
  }
}

export default SignInForm;
