import React, { useState, useEffect } from 'react';
import Sidebar from '../reuse/user-side';
import '../../styles/user-dash.css';  
import '../../styles/head-common.css'; 
import '../../styles/tic-tac-toe.css'; 
import DashHead from '../reuse/header2';
import { Link } from 'react-router-dom';

function TicTacToe2() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [isHumanVsCpu, setIsHumanVsCpu] = useState(true); // Toggle between Human vs Human or Human vs CPU
  const winner = calculateWinner(board);

  // Handle CPU move
  useEffect(() => {
    if (!isXNext && isHumanVsCpu && !winner) {
      const cpuMove = getCpuMove(board);
      if (cpuMove !== -1) {
        setTimeout(() => {
          const newBoard = board.slice();
          newBoard[cpuMove] = 'O';
          setBoard(newBoard);
          setIsXNext(true);
        }, 500); // Simulate a slight delay for CPU move
      }
    }
  }, [board, isXNext, isHumanVsCpu, winner]);

  const handleClick = (index) => {
    if (board[index] || winner) return; // Prevent overwriting or playing after game ends
    const newBoard = board.slice();
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);
    setIsXNext(!isXNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  const toggleGameMode = () => {
    setIsHumanVsCpu(!isHumanVsCpu);
    resetGame();
  };

  const renderCell = (index) => {
    return (
      <button className="cell" onClick={() => handleClick(index)}>
        {board[index]}
      </button>
    );
  };

  const getStatus = () => {
    if (winner) {
      return `Winner: ${winner}`;
    } else if (board.every(cell => cell !== null)) {
      return 'Draw!';
    } else {
      return `Next Player: ${isXNext ? 'X' : 'O'}`;
    }
  };

  return (
    <div>
      <div className='head-customer'>
        <DashHead />
      </div>
      <div className='dashboard-container'>
        <Sidebar />
        <div className='dashboard-content'>
          <div className='content'>  
          <h2>Tic Tac Toe</h2>
          <div className="status">{getStatus()}</div>
          <div className="board">
            <div className="board-row">
              {renderCell(0)}
              {renderCell(1)}
              {renderCell(2)}
            </div>
            <div className="board-row">
              {renderCell(3)}
              {renderCell(4)}
              {renderCell(5)}
            </div>
            <div className="board-row">
              {renderCell(6)}
              {renderCell(7)}
              {renderCell(8)}
            </div>
          </div>
          <button className="reset-button" onClick={resetGame}>Reset Game</button>
          <button className="mode-toggle-button" onClick={toggleGameMode}>
            {isHumanVsCpu ? 'Switch to Human vs Human' : 'Switch to Human vs CPU'}
          </button>
          <div className="d-flex justify-content-end mb-3">
                <Link to={`/XOXO`} className="btn btn-outline-primary">
                    Quit
                </Link>
            </div>
        </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to determine the winner
function calculateWinner(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

// Helper function for CPU move
function getCpuMove(board) {
  // Check for a winning move for CPU (O)
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      const newBoard = board.slice();
      newBoard[i] = 'O';
      if (calculateWinner(newBoard) === 'O') { // Fixed: Added closing parenthesis
        return i;
      }
    }
  }

  // Check for a blocking move (prevent Human (X) from winning)
  for (let i = 0; i < 9; i++) {
    if (!board[i]) {
      const newBoard = board.slice();
      newBoard[i] = 'X';
      if (calculateWinner(newBoard) === 'X') { // Fixed: Added closing parenthesis
        return i;
      }
    }
  }

  // If no winning or blocking move, choose a random available cell
  const availableCells = board.map((cell, index) => cell === null ? index : null).filter(val => val !== null);
  if (availableCells.length > 0) {
    return availableCells[Math.floor(Math.random() * availableCells.length)];
  }

  return -1; // No available moves
}

export default TicTacToe2;