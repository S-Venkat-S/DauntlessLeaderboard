import React, { Component } from "react";
import { hot } from "react-hot-loader/root";
import Landing from "./pages/landing";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <Landing />
      </div>
    );
  }
}

export default hot(App);
