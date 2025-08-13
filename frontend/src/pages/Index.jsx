import React from "react";
import QuestionCard from "../components/QuestionCard";
import { Container, Row, Col } from "react-bootstrap";
import questions from "../questions";

function Index() {
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
