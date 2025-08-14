import React from "react";
import { ListGroup, Row, Col, Container, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import questions from "../questions";

function QuestionPage() {
  const { id } = useParams();

  const question = questions.find((q) => q.id === Number(id));

  return (
    <Row className="d-flex align-items-center" style={{ minHeight: "50vh" }}>
      <Col md={12}>
        <ListGroup>
          <ListGroup.Item>
            <Row>
              <Col md={12}>
                <Card className="text-center">
                  <Card.Header>
                    <h2>{question.title}</h2>
                  </Card.Header>
                  <Card.Body>
                    <Card.Text>{question.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </ListGroup.Item>
        </ListGroup>
      </Col>
    </Row>
  );
}

export default QuestionPage;
