import React from "react";
import QuestionCard from "../components/QuestionCard";
import { Container, Row, Col } from "react-bootstrap";

function Index() {
  const questions = [
    { id: 1, title: "Question 1", description: "Description for question 1" },
    { id: 2, title: "Question 2", description: "Description for question 2" },
  ];

  return (
    <Container>
      <Row>
        {questions.map((question) => (
          <Col key={question.id} sm={12} md={6} lg={4} xl={3}>
            <QuestionCard question={question} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Index;
