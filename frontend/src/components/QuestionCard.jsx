import React from "react";
import { Card } from "react-bootstrap";

function QuestionCard({ question }) {
  return (
    <Card className="my-3 p-3 rounded">
      <Card.Body>
        <Card.Title> {question.title} </Card.Title>
        <Card.Text>{question.description}</Card.Text>
      </Card.Body>
    </Card>
  );
}

export default QuestionCard;
