import React from "react";
import AnswerCard from "./AnswerCard";

export default function QuestionCard({
  question,
  onSelectAnswer,
  questionIndex,
  answers,
  isSubmited,
}) {
  return (
    <div className="mb-5">
      <div className="flex flex-col gap-3 max-w-4xl border-b border-solid border-primary-300">
        <h3 className="text-xl font-bold font-karla text-primary-500">
          {question}
        </h3>

        <div className="flex flex-wrap gap-4 mb-5">
          {answers.map((answer, idx) => (
            <AnswerCard
              answer={answer}
              isSubmited={isSubmited}
              onClick={() => {
                onSelectAnswer(questionIndex, idx);
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
