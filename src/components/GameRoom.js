import { useState, useEffect, useCallback } from "react";
import Confetti from "react-confetti";
import { useCheckResult } from "../App";
import { API_URL } from "./helpers/constants";
import shuffle from "./helpers/shuffle";
import QuestionCard from "./QuestionCard";
import Score from "./Score";
import Spinner from "./Spinner";

function GameRoom() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchGameFailed, setFetchGameFailed] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState("");
  const { setIsChecked, isChecked } = useCheckResult();
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    with: window.innerWidth,
  });
  const [isSubmited, setIsSubmited] = useState(false);
  const [score, setScore] = useState(0);
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(API_URL);
      const data = await response.json();
      data.results.forEach(({ correct_answer, incorrect_answers }, index) => {
        data.results[index].all_answers = shuffle([
          ...incorrect_answers,
          correct_answer,
        ]);
      });
      setGames(() =>
        data.results.map((q) => ({
          question: q.question,
          answers: [
            ...q.incorrect_answers.map((a) => ({
              isHeld: false,
              isCorrect: false,
              value: a,
            })),
            ...(Array.isArray(q.correct_answer)
              ? q.correct_answer
              : [q.correct_answer]
            ).map((a) => ({
              isHeld: false,
              isCorrect: true,
              value: a,
            })),
          ],
        }))
      );
      setIsLoading(false);
      setIsChecked(false);
      setSelectedAnswers([]);
      setIsSubmited(false);
    } catch (err) {
      setFetchGameFailed(true);
      setSelectedAnswers([]);
      setIsLoading(false);
      setIsChecked(false);
    }
  }, [setIsChecked]);

  useEffect(() => {
    const resizer = (e) => {
      setDimensions({
        with: e.target.innerWidth,
        height: e.target.innerHeight,
      });
    };
    window.addEventListener("resize", resizer);
    return () => {
      setScore(0);
      window.removeEventListener("resize", resizer);
    };
  }, []);
  useEffect(() => {
    if (
      games.filter(({ answers }) => {
        const v = answers.filter((a) => a.isHeld);
        return v.length > 0;
      }).length > 0
    )
      setSelectedAnswers(true);
    else setSelectedAnswers(false);
  }, [games]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function onSelectAnswer(id, answerId) {
    const qs = [...games];
    const answers = qs[id].answers.map((a) => {
      if (a.isHeld) return { ...a, isHeld: false };
      else return a;
    });
    answers[answerId] = {
      ...answers[answerId],
      isHeld: !answers[answerId].isHeld,
    };
    qs[id].answers = answers;
    setGames((prev) => qs);
  }

  function checkForWinning() {
    const b = games.filter((g) => {
      const a = g.answers.filter((a) => a.isCorrect && a.isHeld);
      return a.length > 0;
    });
    setScore(b.length);
  }

  if (fetchGameFailed && !isLoading) {
    return (
      <div className="fixed inset-0 bg-primary-300">
        <div className="w-fit px-32 py-32 bg-white text-2xl text-primary-500 font-karla rounded-2xl">
          Failed to fetch questions
        </div>
      </div>
    );
  } else
    return (
      <div className="z-50">
        {isLoading ? (
          <Spinner />
        ) : (
          <div>
            {score > 1 && (
              <div className="w-fit mx-auto">
                <Confetti width={dimensions.with} height={dimensions.height} />
              </div>
            )}
            {games.map(({ question, answers }, index) => {
              return (
                <div key={index} className="mb-5">
                  <QuestionCard
                    question={question}
                    onSelectAnswer={onSelectAnswer}
                    questionIndex={index}
                    answers={answers}
                    isSubmited={isSubmited}
                  />
                </div>
              );
            })}
            {isSubmited ? (
              <Score
                games={games}
                score={score}
                onClick={() => {
                  setScore(0);
                  fetchData();
                }}
              />
            ) : isChecked ? (
              <button
                onClick={() => {
                  setScore(0);
                  fetchData();
                }}
                className="bg-primary-500 text-white text-xl px-5 py-2 rounded-lg font-karla"
              >
                Load new questions
              </button>
            ) : (
              <button
                onClick={() => {
                  if (!selectedAnswers) {
                    setScore(0);
                    fetchData();
                  } else {
                    setIsChecked(true);
                    checkForWinning();
                    setIsSubmited(true);
                  }
                }}
                className="bg-primary-500 text-white text-xl px-5 py-2 rounded-lg font-karla"
              >
                {selectedAnswers ? "Check answers" : "Load new questions"}
              </button>
            )}
          </div>
        )}
      </div>
    );
}

export default GameRoom;
