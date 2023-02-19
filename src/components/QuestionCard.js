import React, { useState } from "react";
import AnswerCard from "./AnswerCard";

export default function QuestionCard({
  question,
  onSelectAnswer,
  questionIndex,
}) {
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const { question: questionStatement, all_answers, correct_answer } = question;

  return (
    <div className="mb-5">
      <div className="flex flex-col gap-3 max-w-4xl border-b border-solid border-primary-300">
        <h3 className="text-xl font-bold font-karla text-primary-500">
          {questionStatement}
        </h3>

        <div className="flex flex-wrap gap-4 mb-5">
          {all_answers.map((answer) => (
            <AnswerCard
              correctAnswer={correct_answer}
              answer={answer}
              selectedAnswer={selectedAnswer}
              onClick={() => {
                onSelectAnswer({ answer, questionIndex });
                setSelectedAnswer(answer);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
