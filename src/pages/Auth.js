import React, { Component } from "react";
import { Form, Button } from "react-bootstrap";
import AuthContext from "../context/auth-context";

class Auth extends Component {
  state = {
    isLogin: true,
  };

  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
  }
  chageHandler = (event) => {
    event.preventDefault();
    this.setState((prevState) => {
      return { isLogin: !prevState.isLogin };
    });
  };
  submitHandler = (event) => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return 0;
    }

    let requestBody = {
      query: `
            query{
                login(email:"${email}", password:"${password}"){
                    userId
                    token
                    tokenExpiration
                }
            }
        `,
    };

    if (!this.state.isLogin) {
      requestBody = {
        query: `
                mutation{
                    createUser(inputUser: {email:"${email}", password:"${password}"}){
                        _id
                        email
                    }
                }
            `,
      };
    }

    fetch("http://127.0.0.1:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((res) => {
        if (res.data.login.token) {
          this.context.login(
            res.data.login.token,
            res.data.login.userId,
            res.data.login.tokenExpiration
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    return (
      <Form onSubmit={this.submitHandler}>
        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            ref={this.emailEl}
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password"
            ref={this.passwordEl}
          />
        </Form.Group>
        <>
          <Button variant="primary" type="submit">
            Submit
          </Button>
          <Button
            variant="outline-warning"
            style={{ margin: "10px" }}
            type="button"
            onClick={this.chageHandler}
          >
            Switch to {this.state.isLogin ? "Signup" : "Login"}
          </Button>
        </>
      </Form>
    );
  }
}

export default Auth;
