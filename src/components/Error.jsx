import { Button, Image } from "@mantine/core";
import React, { Component } from "react";
import { ArrowBackUp } from "tabler-icons-react";
import ERROR from "../assets/images/error.png";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null, errorInfo: null };
  }

  // For this example we'll just use componentDidCatch, this is only
  // here to show you what this method would look like.
  // static getDerivedStateFromProps(error){
  // return { error: true }
  // }

  componentDidCatch(error, info) {
    this.setState({ error: error, errorInfo: info });
  }

  handleClick() {
    try {
      window.location.href = "/";
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    if (this.state.errorInfo) {
      return (
        <div className="error-boundary">
          <summary>Something went wrong</summary>
          <details style={{ whiteSpace: "pre-wrap" }}>
            {this.state.error && this.state.error.toString()}
            {this.state.errorInfo.componentStack}
          </details>
          <div
            style={{
              margin: "auto",
            }}
          >
            <img src={ERROR} width={400}></img>
          </div>

          <div className="text">
            <h4>Something went wrong on this page</h4>
            <p>
              Some error occurred you can see details and fix it. <br /> Due to
              some error occurred on this page cannot be able to render retry
              again or contact us.
            </p>
            <Button mt={25} mb={50} onClick={this.handleClick}>
              Return to home dashboard &nbsp; &nbsp;
              <ArrowBackUp />
            </Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
