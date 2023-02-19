import { useState, useEffect, useCallback } from "react";
import Confetti from "react-confetti";
import { useCheckResult } from "../App";
import { API_URL } from "./helpers/constants";
import shuffle from "./helpers/shuffle";
import QuestionCard from "./QuestionCard";
import Spinner from "./Spinner";
// import useWindowSize from "react-use";

function GameRoom() {
  const [games, setGames] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchGameFailed, setFetchGameFailed] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState("");
  const { setIsChecked, isChecked } = useCheckResult();
  const [won, setWon] = useState(false);
  const [dimensions, setDimensions] = useState({
    height: window.innerHeight,
    with: window.innerWidth,
  });

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
      setGames(data.results);
      setIsLoading(false);
      setIsChecked(false);
      setSelectedAnswers([]);
      setWon(false);
    } catch (err) {
      setFetchGameFailed(true);
      setSelectedAnswers([]);
      setIsLoading(false);
      setIsChecked(false);
      setWon(false);
    }
  }, []);

  useEffect(() => {
    const resizer = (e) => {
      setDimensions({
        with: e.target.innerWidth,
        height: e.target.innerHeight,
      });
    };
    window.addEventListener("resize", resizer);
    return () => {
      window.removeEventListener("resize", resizer);
    };
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  function onSelectAnswer(answer) {
    setSelectedAnswers((prev) => [...prev, { answer }]);
  }

  function checkForWinning() {
    let isWining = false;
    selectedAnswers.forEach(({ answer: { answer, questionIndex } }) => {
      games.forEach(({ correct_answer }, index) => {
        if (questionIndex === index) {
          if (answer !== correct_answer) {
            isWining = false;
            return;
          }
          isWining = true;
        }
      });
    });
    setWon(isWining);
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
            {won && (
              <div className="w-fit mx-auto">
                <Confetti width={dimensions.with} height={dimensions.height} />
              </div>
            )}
            {games.map((question, index) => {
              return (
                <div key={index} className="mb-5">
                  <QuestionCard
                    question={question}
                    onSelectAnswer={onSelectAnswer}
                    questionIndex={index}
                  />
                </div>
              );
            })}
            {isChecked ? (
              <button
                onClick={() => {
                  fetchData();
                }}
                className="bg-primary-500 text-white text-xl px-5 py-2 rounded-lg font-karla"
              >
                Load new questions
              </button>
            ) : (
              <button
                onClick={() => {
                  if (!selectedAnswers.length) fetchData();
                  else {
                    setIsChecked(true);
                    checkForWinning();
                  }
                }}
                className="bg-primary-500 text-white text-xl px-5 py-2 rounded-lg font-karla"
              >
                {!selectedAnswers.length ? "Load new questions" : "Check"}
              </button>
            )}
          </div>
        )}
      </div>
    );
}

export default GameRoom;
