import React from "react";
import { Spinner, Container } from "react-bootstrap";

function Loader() {
  return (
    <Container
      className="d-flex align-items-center"
      style={{ minHeight: "70vh" }}
    >
      <Spinner
        animation="border"
        role="status"
        style={{
          height: "100px",
          width: "100px",
          margin: "auto",
          display: "block",
        }}
      ></Spinner>
    </Container>
  );
}

export default Loader;
