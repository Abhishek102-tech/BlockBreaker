import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [score, setScore] = useState(0);

  const ballRef = useRef(null);
  const gamecontainerRef = useRef(null);
  const paddleRef = useRef(null);

  const [ballX, setBallX] = useState(50);
  const [ballY, setBallY] = useState(81);
  const [isPlaying, setIsPlaying] = useState(false);

  
  const speedX = useRef(0.5);
  const speedY = useRef(-0.5);

  useEffect(() => {
    let animationFrameId;

    const gameLoop = () => {
      if(ballRef.current) {
        const ballRect = ballRef.current.getBoundingClientRect();
        const containerRect = gamecontainerRef.current.getBoundingClientRect();

        if (ballRect.left <= containerRect.left || ballRect.right >= containerRect.right) {
          speedX.current = -speedX.current;
        }
        if (ballRect.top <= containerRect.top || ballRect.bottom >= containerRect.bottom) {
          speedY.current = -speedY.current;
        }
      }
      setBallX(prevX => prevX + speedX.current);
      setBallY(prevY => prevY + speedY.current);
      animationFrameId = requestAnimationFrame(gameLoop);
    };

    if (isPlaying) {
      animationFrameId = requestAnimationFrame(gameLoop);
    }
    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying]);

  useEffect(() => {
    const handleClick = (e) => {
      setIsPlaying(true); 
      paddleRef.current.style.left = `${e.clientX - paddleRef.current.offsetWidth / 2}px`;
    };
    
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <>
      <div className="settings"><span className="material-symbols-outlined menu">
menu
</span></div><header className='heading'>Block Busters</header>
<div className="score">Score: {score}</div>
      <div className="game-container" ref={gamecontainerRef}>
        <div className="game">
          
          <div className="blocks">
            <div className="block"></div>
            <div className="block"></div>
            <div className="block"></div>
            <div className="block"></div>
            <div className="block"></div>
          </div>
          <div className="paddle" ref={paddleRef}></div>
          <div className="ball" ref={ballRef} style={{ left: `${ballX}%`, top: `${ballY}%` }}></div>
        </div>
      </div>
    </>
  )
}

export default App;
