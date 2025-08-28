import React from "react";
import { Alert } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

function Message({ variant, text, linkText, linkUrl }) {
  return (
    <Alert variant={variant}>
      {text}
      <LinkContainer to={linkUrl}>
        <Alert.Link className="link-underline-light link-underline-opacity-0 link-underline-opacity-75-hover">
          {linkText}
        </Alert.Link>
      </LinkContainer>
    </Alert>
  );
}

export default Message;
