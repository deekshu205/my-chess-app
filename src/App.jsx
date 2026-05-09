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
    try {
      const result = game.move(move); // chess.js validates the move
      
      if (result) {
        // If the move is legal, we update the state.
        // We use a new instance of the game object so React "notices" the change.
        setGame(new Chess(game.fen())); 
        setMoveHistory([...moveHistory, result.san]); // Add move to history
        return true;
      }
    } catch (e) {
      return null; // Illegal move
    }
    return null;
  }

  function onDrop(sourceSquare, targetSquare) {
    const move = makeAMove({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q", // Default to queen for simplicity (Software Principle: MVP)
    });

    if (move === null) return false;
    return true;
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