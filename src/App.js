import React, { Component } from "react";
import {
  BrowserRouter,
  Route,
  Redirect,
  Switch,
  NavLink,
} from "react-router-dom";
import "./App.css";
import Auth from "./pages/Auth";
import Booking from "./pages/Booking";
import Event from "./pages/Event";
import AuthContext from "./context/auth-context";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
class App extends Component {
  state = {
    token: null,
    userId: null,
  };
  login = (token, userId, tokenExpiration) => {
    this.setState({
      token: token,
      userId: userId,
    });
  };
  logout = () => {
    this.setState({
      token: null,
      userId: null,
    });
  };

  render() {
    return (
      <BrowserRouter>
        <Container>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              userId: this.state.logout,
              login: this.login,
              logout: this.logout,
            }}
          >
            <Navbar collapseOnSelect expand="lg" bg="info" variant="dark">
              <NavLink className="navbar-brand" to="/">
                Event Management
              </NavLink>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto"></Nav>
                <Nav>
                  {!this.state.token && (
                    <NavLink className="nav-link" to="/">
                      Login
                    </NavLink>
                  )}

                  <NavLink className="nav-link" to="/event">
                    Events
                  </NavLink>

                  {this.state.token && (
                    <React.Fragment>
                      <NavLink className="nav-link" to="/booking">
                        Bookings
                      </NavLink>

                      <Button variant="danger" onClick={this.logout}>
                        Logout
                      </Button>
                    </React.Fragment>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Navbar>

            <Switch>
              {this.state.token && <Redirect from="/" to="/event" exact />}
              {this.state.token && <Redirect from="/auth" to="/event" exact />}

              {!this.state.token && <Route path="/auth" component={Auth} />}
              {this.state.token && (
                <Route path="/booking" component={Booking} />
              )}
              <Route path="/event" component={Event} />
              {!this.state.token && <Redirect to="/auth" exact />}
            </Switch>
          </AuthContext.Provider>
        </Container>
      </BrowserRouter>
    );
  }
}

export default App;
