import React, { useState, useEffect } from "react";
import { ListGroup, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loader from "../components/Loader";
import Message from "../components/Message";

function QuestionPage() {
  const { id } = useParams();

  const [feedback, setFeedback] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAnswerHandler = (e) => {
    e.preventDefault();
    if (selectedOption === question.correct_answer) {
      setFeedback({
        type: "success",
        text: "Resposta correta!",
        linkText: "Voltar ao início",
        linkUrl: "/",
      });
    } else {
      setFeedback({
        type: "danger",
        text: "Resposta errada! Tente novamente.",
        linkText: "",
        linkUrl: "",
      });
    }
  };

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
                <Card className="text-center" style={{ minHeight: "80vh" }}>
                  <Card.Header as="h5">
                    {question.edition.year} | {question.theme.name}
                  </Card.Header>
                  <Card.Body as={"div"}>
                    {feedback && (
                      <Message
                        variant={feedback.type}
                        text={feedback.text}
                        linkText={feedback.linkText}
                        linkUrl={feedback.linkUrl}
                      />
                    )}

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
                              value={option.option}
                              onChange={(e) =>
                                setSelectedOption(e.target.value)
                              }
                            />
                          </div>
                        ))}
                        <Button
                          variant="dark"
                          className="my-5 d-flex align-items-center"
                          onClick={checkAnswerHandler}
                          disabled={!selectedOption}
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
