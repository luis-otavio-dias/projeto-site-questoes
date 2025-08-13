import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

function QuestionCard({ question }) {
  return (
    <Card border="primary" className="my-3 rounded">
      <Link
        to={`/questions/${question.id}`}
        className="text-decoration-none text-dark"
        style={{ cursor: "pointer" }}
      >
        <Card.Header>{question.title}</Card.Header>
        <Card.Body>
          <Card.Text>{question.description}</Card.Text>
        </Card.Body>
      </Link>
    </Card>
  );
}

export default QuestionCard;
