import React, { useState, useEffect } from "react";
import QuestionCard from "../components/QuestionCard";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import Loader from "../components/Loader";
import Message from "../components/Message";

function Index() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/questions");
        setQuestions(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch question");
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Message variant="danger">{error}</Message>;
  }

  return (
    <Container
      className="d-flex align-items-center"
      style={{ minHeight: "90vh" }}
    >
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
