import React from "react";

function Score({ onClick, score }) {
  return (
    <div className="flex justify-center items-center gap-8">
      <h1 className="text-3xl text-primary-500 font-bold pt-7">
        You scored {score}
        /4 correct answers
      </h1>
      <button
        onClick={onClick}
        className="py-5 px-20 bg-primary-300 text-white text-2xl rounded-2xl font-karla mt-10"
      >
        Play again
      </button>
    </div>
  );
}

export default Score;
