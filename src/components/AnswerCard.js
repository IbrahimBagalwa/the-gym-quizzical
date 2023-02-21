export default function AnswerCard({ answer, onClick, isSubmited }) {
  return (
    <div
      onClick={onClick}
      className={`text-xl cursor-pointer ${
        answer.isHeld
          ? !isSubmited || (isSubmited && answer.isCorrect)
            ? "bg-green-400"
            : "bg-red-400"
          : isSubmited && answer.isCorrect
          ? "bg-green-400"
          : ""
      } font-karla py-2 px-5 border border-solid border-primary-500 rounded-2xl`}
    >
      {answer.value}
    </div>
  );
}
