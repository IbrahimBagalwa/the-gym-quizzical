import { createContext, useContext, useState } from "react";
import GameRoom from "./components/GameRoom";
import Starter from "./components/Starter";

const Contex = createContext({ isChecked: false, setIsChecked: () => null });
export const useCheckResult = () => useContext(Contex);

function CheckProvider({ children }) {
  const [isChecked, setIsChecked] = useState(false);
  return (
    <Contex.Provider value={{ isChecked, setIsChecked }}>
      {children}
    </Contex.Provider>
  );
}

function App() {
  const [isGameStarted, setIsGameStarted] = useState(false);
  const onStartGame = () => {
    setIsGameStarted(true);
  };
  return (
    <CheckProvider>
      <div className="w-full h-screen bg-primary-100">
        <img
          className="w-64 h-64 absolute bottom-0"
          src="/blob 5.png"
          alt="blob1"
        />
        <img
          className="w-64 h-64 absolute top-0 right-0"
          src="/blobtop.png"
          alt="blob2"
        />
        <div className="flex justify-center items-center h-full w-full">
          {isGameStarted ? <GameRoom /> : <Starter onClick={onStartGame} />}
        </div>
      </div>
    </CheckProvider>
  );
}

export default App;
