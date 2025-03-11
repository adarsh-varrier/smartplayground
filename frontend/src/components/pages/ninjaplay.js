import React, { useEffect, useRef, useState } from 'react';
import Sidebar from '../reuse/user-side';
import '../../styles/user-dash.css';  
import '../../styles/head-common.css'; 
import DashHead from '../reuse/header2';

import humanImage from '../../assets/Human.jpg';

function NinjaPlay() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Load the human image
    const human = new Image();
    human.src = humanImage;

    // Game variables
    const ninja = {
      x: 50,
      y: canvas.height - 100, // Initial position
      width: 40,
      height: 60,
      dy: 0, // Vertical velocity
      jumpStrength: -12, // Jump strength
      gravity: 0.5, // Gravity
      isJumping: false,
    };

    let obstacles = [];
    let obstacleSpeed = 5; // Initial speed
    let obstacleSpawnRate = 120; // Frames between obstacles
    let frameCount = 0;
    let currentScore = 0; // Track score inside the game loop

    // Draw the ninja
    const drawNinja = () => {
      ctx.drawImage(human, ninja.x, ninja.y, ninja.width, ninja.height);
    };

    // Draw obstacles
    const drawObstacles = () => {
      ctx.fillStyle = '#FF0000';
      obstacles.forEach((obstacle) => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      });
    };

    // Update ninja position
    const updateNinja = () => {
      ninja.dy += ninja.gravity; // Apply gravity
      ninja.y += ninja.dy; // Update vertical position

      // Prevent ninja from falling through the ground
      if (ninja.y + ninja.height >= canvas.height) {
        ninja.y = canvas.height - ninja.height;
        ninja.dy = 0;
        ninja.isJumping = false;
      }
    };

    // Update obstacles
    const updateObstacles = () => {
      // Move obstacles to the left
      obstacles.forEach((obstacle) => {
        obstacle.x -= obstacleSpeed;
      });

      // Remove obstacles that are off-screen before checking for collisions
      if (obstacles.length > 0 && obstacles[0].x + obstacles[0].width < 0) {
        obstacles.shift();
        currentScore += 1; // Increment score when an obstacle is passed
        setScore(currentScore); // Update state outside the loop

        // Gradually increase obstacle speed based on score
        if (currentScore % 5 === 0) { // Increase speed every 5 points
          obstacleSpeed += 0.5; // Adjust the increment as needed
        }
      }

      // Spawn new obstacles after a delay
      if (frameCount % obstacleSpawnRate === 0) {
        const minHeight = 20; // Minimum obstacle height
        const maxHeight = 80; // Maximum obstacle height
        const obstacleHeight = Math.random() * (maxHeight - minHeight) + minHeight; // Random height
        obstacles.push({
          x: canvas.width,
          y: canvas.height - obstacleHeight,
          width: 30,
          height: obstacleHeight,
        });
      }
    };

    // Check for collisions
    const checkCollisions = () => {
      for (const obstacle of obstacles) {
        if (
          ninja.x < obstacle.x + obstacle.width && // Ninja’s left side is before obstacle’s right
          ninja.x + ninja.width > obstacle.x &&    // Ninja’s right side is after obstacle’s left
          ninja.y + ninja.height > obstacle.y &&   // Ninja’s bottom is below obstacle’s top
          ninja.y < obstacle.y + obstacle.height  // Ninja’s top is above obstacle’s bottom
        ) {
          return true; // Collision detected
        }
      }
    };

    // Game loop
    const gameLoop = () => {

      // Clear the canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update game state
      updateObstacles();
      updateNinja();

      // Check for collisions
      if (checkCollisions()) {
        setGameOver(true); // Set game over state if collision occurs
        return; // Stop the game loop
      }

      // Draw game elements
      drawNinja();
      drawObstacles();

      // Display score
      ctx.fillStyle = '#000';
      ctx.font = '20px Arial';
      ctx.fillText(`Score: ${currentScore}`, 10, 30);

      // Continue the game loop
      frameCount++;
      requestAnimationFrame(gameLoop);
    };

    // Handle keyboard input
    const handleKeyDown = (e) => {
      if ((e.code === 'Space' || e.code === 'ArrowUp') && !ninja.isJumping) {
        ninja.dy = ninja.jumpStrength;
        ninja.isJumping = true;
      }
    };

    // Start the game
    window.addEventListener('keydown', handleKeyDown);
    gameLoop();

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameOver]);

  return (
    <div>
      <div className='head-customer'>
        <DashHead />
      </div>
      <div className='dashboard-container'>
        <Sidebar />
        <div className='dashboard-content text-center p-4 bg-light rounded shadow'>
          <h2 className='mb-4 display-4 text-primary'>Ninja Play</h2>
          <div className='ninjaplay'>
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              style={{ border: '1px solid #000', backgroundColor: '#f0f0f0' }}
            ></canvas>
            <h3 className="mt-3">Score: {score}</h3>
            {gameOver && (
              <div className="mt-3">
                
                <button
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  Restart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NinjaPlay;