import { useState } from "react";
import { Chess } from "chess.js"; // The Logic Engine
import { Chessboard } from "react-chessboard"; // The Visual Board
import "./App.css";

function App() {
  // PRINCIPLE: State Management
  // We initialize the chess engine. 'game' is our "Source of Truth".
  const [game, setGame] = useState(new Chess());
  const [moveHistory, setMoveHistory] = useState([]);

  // REASON: This function handles the "Intent" of moving a piece.
  function makeAMove(move) {
    // PRINCIPLE: Defensive Programming
    // We wrap this in a functional update to ensure we have the latest state
    const gameCopy = new Chess(game.fen()); 
    
    try {
      const result = gameCopy.move(move);
      if (result) {
        setGame(gameCopy); // REASON: Providing a BRAND NEW object triggers re-render
        setMoveHistory((prev) => [...prev, result.san]); // Using functional update for history
        return result;
      }
    } catch (e) {
      console.log("Invalid Move:", e);
      return null;
    }
    return null;
  }

  function onDrop(sourceSquare, targetSquare) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", 
    });

    // If move is null, the board will automatically snap the piece back
    return move !== null;
  }

  return (
    <div className="app-container">
      <h1>Vibe Chess</h1>
      <div className="game-layout">
        <div className="board-wrapper">
          <Chessboard position={game.fen()} onPieceDrop={onDrop} />
        </div>
        
        {/* REASON: Separation of Concerns - Move History is its own section */}
        <div className="history-sidebar">
          <h3>Move History</h3>
          <ul>
            {moveHistory.map((move, index) => (
              <li key={index}>{index + 1}. {move}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;