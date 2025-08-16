import React, { useState, useEffect } from "react";
import { ListGroup, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import Message from "../components/Message";

function QuestionPage() {
  const { id } = useParams();

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchQuestion() {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/questions/${id}`);
        setQuestion(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch question");
      } finally {
        setLoading(false);
      }
    }

    fetchQuestion();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Message variant="danger">{error}</Message>;
  }

  return (
    <Row className="d-flex align-items-center" style={{ minHeight: "90vh" }}>
      <Col md={12}>
        <ListGroup variant="flush">
          <ListGroup.Item>
            <Row>
              <Col md={12}>
                <Card
                  className="text-center"
                  style={{ minHeight: "80vh" }}
                  // style={{ minHeight: "800px", minWidth: "500px" }}
                >
                  <Card.Header as="h5">
                    {question.edition.year} | {question.theme.name}
                  </Card.Header>
                  <Card.Body>
                    <Card.Text className="my-4 text-sm-start fs-5">
                      {question.stem}
                    </Card.Text>

                    <Card.Text as={"div"}>
                      <Form className="mt-5">
                        {question.answer_options.map((option) => (
                          <div
                            key={option.id}
                            className="ms-3 d-flex align-items-center fw-bold fs-6 mb-3"
                          >
                            <Form.Check
                              name="options"
                              label={`${option.option}) ${option.option_text}`}
                              type="radio"
                              id={`check-${option.option}`}
                            />
                          </div>
                        ))}
                        <Button
                          variant="primary"
                          type="submit"
                          className="my-5 d-flex align-items-center"
                        >
                          Enviar
                        </Button>
                      </Form>
                    </Card.Text>
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
