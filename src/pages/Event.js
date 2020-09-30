import React, { Component } from "react";
import { Form, Button, Modal } from "react-bootstrap";
import AuthContext from "../context/auth-context";
import { resolveFieldValueOrError } from "graphql/execution/execute";

class Event extends Component {
  state = {
    show: false,
    setShow: false,
    events: []
  };
  static contextType = AuthContext;
  constructor(props) {
    super(props);
    this.titleEl = React.createRef();
    this.descriptionEl = React.createRef();
    this.priceEl = React.createRef();
    this.dateEl = React.createRef();
  }
  handleClose = () => {
    this.setState((prevState) => {
      return { setShow: false, show: false };
    });
  };
  handleShow = () => {
    this.setState((prevState) => {
      return { setShow: true, show: true };
    });
  };
  componentDidMount() {
      this.fetchEvents()
  }
  submitHandler = (event) => {
    event.preventDefault();
    this.handleClose()
    const title = this.titleEl.current.value;
    const description = this.descriptionEl.current.value;
    const price = +this.priceEl.current.value;
    const date = new Date(this.dateEl.current.value).toISOString();

    // if (
    //   title.trim().length === 0 ||
    //   price.trim().length === 0 ||
    //   date.trim().length === 0 ||
    //   description.trim().length === 0
    // ) {
    //   return 0;
    // }

    let requestBody = {
      query: `
                mutation{
                    createEvent(inputEvent: {title:"${title}", description:"${description}",price:${price},date:"${date}"}){
                        _id
                        title
                    }
                }
            `,
    };
    const token =  this.context.token;
    fetch("http://127.0.0.1:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer "+token
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((res) => {
        this.fetchEvents()
      })
      .catch((err) => {
        console.log(err);
      });
  };
  fetchEvents = () => {
    
    let requestBody = {
      query: `
            query{
                events{
                    _id
                    title
                    description
                    price
                    date
                    creator{
                        email
                    }
                }
            }
        `,
    };
    fetch("http://127.0.0.1:5000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((res) => {
        this.setState({
            events: res.data.events
        })
      })
      .catch((err) => {
        console.log(err);
      });
  };
  render() {
    return (
      <div className="card">
        <div className="card-header">
          <h5 className="float-left">All Events</h5>
          {this.context.token &&
              <div className="float-right">
              <Button
                variant="primary"
                onClick={this.handleShow}
                className="btn btn-primary float-right"
              >
                Add new
              </Button>
            </div>
          
          }
          </div>

        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Title</th>
                <th scope="col">Price</th>
                <th scope="col">Date</th>
                <th scope="col">Creator</th>
              </tr>
            </thead>
            <tbody>
                {this.state.events.length > 0 &&
                    this.state.events.map((event, index) =>{
                        return <tr>
                            <th scope="row">{index+1}</th>
                            <td>{event.title}</td>
                            <td>{event.price}</td>
                            <td>{event.date}</td>
                            <td>{event.creator.email}</td>
                        </tr>
                    })
                }
             </tbody>
          </table>
        </div>

        <Modal
          show={this.state.show}
          onHide={this.handleClose}
          backdrop="static"
          keyboard={false}
        >
          <Form onSubmit={this.submitHandler}>
            <Modal.Header closeButton>
              <Modal.Title>Add new event</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group controlId="formBasicTitle">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Title"
                  ref={this.titleEl}
                />
              </Form.Group>

             
              <Form.Group controlId="formBasicPrice">
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter Price"
                  ref={this.priceEl}
                />
              </Form.Group>

              <Form.Group controlId="formBasicDate">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type="date"
                  placeholder="Enter Date"
                  ref={this.dateEl}
                />
              </Form.Group>
              <Form.Group controlId="ControlTextarea1">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as="textarea" rows="3"
                  placeholder="Enter Description"
                  ref={this.descriptionEl}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
              </Button>
              <Button variant="success" type="submit">Submit</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default Event;
