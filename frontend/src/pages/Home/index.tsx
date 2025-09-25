import { Card } from "../../components/Card";
import { Container } from "../../components/Container";
import { Menu } from "../../components/Menu";
import { LeftBar } from "../../components/LeftBar";
import axios from "axios";
import { useEffect, useState } from "react";
import { Loader } from "../../components/Loader";

type Theme = {
  id: number;
  name: string;
};

type Edition = {
  id: number;
  year: number;
};

type Option = {
  id: number;
  option: string;
  option_text: string;
};

type Question = {
  id: number;
  edition: Edition;
  theme: Theme;
  stem: string;
  answer_options: Option[];
};

export function Home() {
  const AUTH_TOKEN = import.meta.env.VITE_AUTH_TOKEN;
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const { data } = await axios.get("/api/questions/", {
          headers: {
            Authorization: AUTH_TOKEN,
          },
        });
        setQuestions(data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
    console.log(questions);
  }, []);

  return (
    <>
      <Menu />
      <div className="flex flex-col min-h-screen">
        <div className="flex flex-1">
          <LeftBar />
          <div className="flex-1">
            <Container className="h-[90vh] mt-10 border-2 rounded-2xl overflow-auto flex-1">
              <div className="flex flex-wrap gap-10 justify-center bg-scroll">
                {loading && <Loader />}

                {error && <p>{error}</p>}

                {Array.isArray(questions) &&
                  questions.map((q) => (
                    <Card key={`question-${q.id}`} id={q.id}>
                      {q.theme.name} | {q.edition.year}
                      <div>{q.stem}</div>
                      {/* <div>
                      {q.options.map((option) => (
                        <ul key={`option-${option}`}>
                          <li>{option}</li>
                        </ul>
                      ))}
                    </div> */}
                    </Card>
                  ))}
              </div>
            </Container>
          </div>
        </div>
      </div>
    </>
  );
}
