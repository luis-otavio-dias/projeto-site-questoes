import React from "react";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";

function QuestionCard({ question }) {
  return (
    <Card
      border="primary"
      className="my-3 rounded card-hover"
      style={{ minHeight: "200px", minWidth: "300px" }}
    >
      <Link
        to={`/questions/${question.id}`}
        className="text-decoration-none text-dark"
        style={{ cursor: "pointer" }}
      >
        <Card.Header>
          {question.edition.year} | {question.theme.name}{" "}
        </Card.Header>
        <Card.Body>
          <Card.Text>{question.stem}</Card.Text>
        </Card.Body>
      </Link>
    </Card>
  );
}

export default QuestionCard;
