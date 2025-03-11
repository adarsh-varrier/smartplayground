import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../reuse/user-side';
import '../../styles/user-dash.css';  
import '../../styles/head-common.css'; 
import DashHead from '../reuse/header2';

const WORDS = [
    'CRANE', 'PLANT', 'HOUSE', 'TABLE', 'CHAIR', 'BRICK', 'APPLE', 'BREAD', 'CLOUD', 'DREAM',
    'EAGLE', 'FENCE', 'GRAPE', 'HEART', 'IVORY', 'JOKER', 'KNEEL', 'LEMON', 'MANGO', 'NIGHT',
    'OCEAN', 'PENCIL', 'QUICK', 'ROBOT', 'SMILE', 'TIGER', 'UMBRA', 'VIVID', 'WATER', 'XYLOX',
    'YOUTH', 'ZEBRA', 'FLARE', 'GLASS', 'HAPPY', 'INDEX', 'JELLY', 'KITES', 'LIGHT', 'MUSIC',
    'NOVEL', 'ORBIT', 'PLUMB', 'QUEST', 'RIVER', 'SPARK', 'TOWER', 'UNITY', 'VOWEL', 'WOVEN'
  ];
  

function WordlePlay() {
  const [targetWord, setTargetWord] = useState(WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [guesses, setGuesses] = useState(Array(6).fill(''));
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [currentGuess, setCurrentGuess] = useState(Array(5).fill(''));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [resultMessage, setResultMessage] = useState(''); // Store result message

  const handleSubmit = useCallback(() => {
    if (currentGuess.join('').length !== 5) return;

    const newGuesses = [...guesses];
    newGuesses[currentAttempt] = currentGuess.join('');
    setGuesses(newGuesses);
    setCurrentAttempt(currentAttempt + 1);
    setCurrentGuess(Array(5).fill(''));
    setCurrentIndex(0);

    if (currentGuess.join('') === targetWord) {
      setResultMessage('🎉 Congratulations! You guessed the word!');
    } else if (currentAttempt === 5) {
      setResultMessage(`❌ Game over! The word was ${targetWord}.`);
    }
  }, [currentGuess, currentAttempt, guesses, targetWord]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && currentIndex === 5) {
        handleSubmit();
      } else if (e.key === 'Backspace' && currentIndex > 0) {
        setCurrentGuess((prev) => {
          const newGuess = [...prev];
          newGuess[currentIndex - 1] = '';
          return newGuess;
        });
        setCurrentIndex(currentIndex - 1);
      } else if (/^[A-Za-z]$/.test(e.key) && currentIndex < 5) {
        setCurrentGuess((prev) => {
          const newGuess = [...prev];
          newGuess[currentIndex] = e.key.toUpperCase();
          return newGuess;
        });
        setCurrentIndex(currentIndex + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, handleSubmit]);

  const resetGame = () => {
    setTargetWord(WORDS[Math.floor(Math.random() * WORDS.length)]);
    setGuesses(Array(6).fill(''));
    setCurrentAttempt(0);
    setCurrentGuess(Array(5).fill(''));
    setCurrentIndex(0);
    setResultMessage(''); // Clear the result message
  };

  const getCellColor = (rowIndex, cellIndex) => {
    const guess = guesses[rowIndex];
    if (!guess || guess.length < 5) return 'bg-light';

    const letter = guess[cellIndex];
    if (letter === targetWord[cellIndex]) {
      return 'bg-success';
    } else if (targetWord.includes(letter)) {
      return 'bg-warning';
    } else {
      return 'bg-secondary';
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
            <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
                <div className="wordle-container text-center">
                    <h2 className="mb-4 display-4 text-primary">Wordle</h2>

                    <div className="grid">
                    {Array.from({ length: 6 }).map((_, rowIndex) => (
                        <div key={rowIndex} className="d-flex justify-content-center mb-2">
                        {Array.from({ length: 5 }).map((_, cellIndex) => (
                            <div
                            key={cellIndex}
                            className={`cell ${rowIndex < currentAttempt ? getCellColor(rowIndex, cellIndex) : 'bg-light'} text-dark d-flex align-items-center justify-content-center`}
                            style={{ width: '60px', height: '60px', border: '2px solid #ccc', fontSize: '24px', fontWeight: 'bold' }}
                            >
                            {rowIndex === currentAttempt ? currentGuess[cellIndex] : guesses[rowIndex]?.[cellIndex]}
                            </div>
                        ))}
                        </div>
                    ))}
                    </div>

                    <div className="mt-4">
                    <button onClick={resetGame} className="btn btn-secondary">Reset Game</button>
                    </div>

                    {/* Display result message */}
                    {resultMessage && (
                    <div className="mt-3 p-3 bg-white shadow rounded text-dark fw-bold text-center">
                        {resultMessage}
                    </div>
                    )}
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}

export default WordlePlay;
