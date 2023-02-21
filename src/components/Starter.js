export default function Starter({ onClick }) {
  return (
    <div className="flex flex-col justify-center items-center gap-5 font-karla">
      <h1 className="text-6xl font-bold text-primary-500 ">Quizzical</h1>
      <p className="text-3xl text-primary-500">Some description if needed</p>
      <button
        onClick={onClick}
        className="py-5 px-20 bg-primary-300 text-white text-2xl rounded-2xl font-karla mt-10"
      >
        Start quiz
      </button>
    </div>
  );
}
