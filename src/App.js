import React, { Component } from "react";
import axios from "axios";
import { Button, Table, Input, FormGroup } from '@material-ui/core';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      name: "",
      salary: "",
      incomeTax : ""
    };
  }

  //something
  componentDidMount() {
    this._refreshList();
  }

  // onChange function for form
  Change = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  //onSubmit
  onSubmit = e => {
    e.preventDefault();

    let { name, salary, items, incomeTax } = this.state;

    //conditional calculations for Tax
    if (salary <= 9875) {
      let Tax = salary * 0.10;
      incomeTax = salary - Tax;
    } else if (salary >= 9876 && salary <= 40125) {
      let tax = salary * 0.12;
      incomeTax  = tax + 952.50
    } else if (salary >= 40126 && salary <= 85525) {
      let tax = salary * 0.22;
      incomeTax  = tax + 4453.50;
    } else if (salary >= 85526 && salary <= 163300) {
      let tax = salary * 0.24;
      incomeTax  = tax + 14089.50;
    } else if (salary >= 163301 && salary <= 207350) {
      let tax = salary * 0.32;
      incomeTax  = tax + 32089.50;
    } else if (salary >= 207351 && salary <= 518400) {
      let tax = salary * 0.35;
      incomeTax  = tax + 45689.50;
    } else if (salary >= 518400) {
      let tax = salary * 0.45;
      incomeTax  = tax + 150689.50;
    }

    //make an object for all our values to pass into to the array
    let newItemData = {
      name: name,
      salary: `${salary}`,
      incomeTax : `${incomeTax}`
    };
    //set state for newItemData object
    newItemData !== "" &&
      this.setState({
        items: [...items, newItemData],

        name: "",
        salary: "",
        monthlyTax: ""
      });

    axios({
      method: "post",
      url: "https://tax-expres.herokuapp.com/salaries",
      data: newItemData,
      validateStatus: status => {
        return true; // I'm always returning true, you may want to do it depending on the status received
      }
    })
      .then(response => {
        items.push(response.data);

        this.setState({
          items,
          newItemModal: false,
          newItemData: {
            title: "",
            description: "",
            url: ""
          }
        });
      })
      .catch(error => {
        console.log(error.message);
      });
    this._refreshList();
  };

  //delete function
  deleteItem(e, id) {
    let index = this.state.items.findIndex(e => e.id === id);
    let newItems = this.state.items.slice();
    newItems.splice(index, 1);
    this.setState({ items: newItems });
    console.log(newItems);

    fetch("/salaries", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newItems)
    })
      .then(res => res.json())
      .then(response => alert("Success", JSON.stringify(response)))
      .catch(error => console.log("Error", error));
    this._refreshList();
  }

  //get function
  _refreshList() {
    axios
      .get("https://tax-expres.herokuapp.com/salaries")
      .then(response => {
        this.setState({
          items: response.data
        });
      })
      .catch(error => console.log("Error", error));
  }

  render() {
    const { items, name, salary } = this.state;

    return (
      <div className="App container">
        <h1>Income Tax Calculator</h1>
        <br />
        {/* form for salary input */}
        <form>
          <FormGroup className="mr-4">
            <label for="name">Name</label>
            <Input
              name="name"
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={e => this.Change(e)}
            />
          </FormGroup>
          <FormGroup>
            <label for="salary">Salary</label>
            <Input
              name="salary"
              type="text"
              placeholder="Enter income"
              value={salary}
              onChange={e => this.Change(e)}
            />
          </FormGroup>
          <Button color="primary" onClick={e => this.onSubmit(e)}>
            Submit
          </Button>
        </form>
        <br />
        {/* table for user data */}
        <Table>
          <thead>
            <tr>
              <td>Name</td>
              <td>Salary</td>
              <td>Income Tax </td>
            </tr>
          </thead>
          <tbody>
            {items.map(item => {
              return (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.salary}</td>
                  <td>{item.incomeTax }</td>
                  <td>
                    <Button
                      color="outline-danger"
                      size="sm"
                      onClick={this.deleteItem.bind(this, item.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default App;
