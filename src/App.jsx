import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [blocks, setBlocks] = useState(Array(5).fill(true));

  const ballRef = useRef(null);
  const gamecontainerRef = useRef(null);
  const paddleRef = useRef(null);
  const animationRef = useRef(null);
  const ballPos = useRef({ x: 50, y: 81 });
  const speed = useRef({ x: 0.5, y: -0.5 });
  const baseSpeed = useRef(0.5);

  const gameOver = () => {
    setIsPlaying(false);
    ballPos.current = { x: 50, y: 81 };
    speed.current = { x: baseSpeed.current, y: -baseSpeed.current };
    setBlocks(Array(5 + (level - 1) * 2).fill(true));
    setScore(0);
    setLevel(1);
    baseSpeed.current = 0.5;
    if (ballRef.current) {
      ballRef.current.style.left = `${ballPos.current.x}%`;
      ballRef.current.style.top = `${ballPos.current.y}%`;
    }
  };

  const nextLevel = () => {
    setIsPlaying(false);
    ballPos.current = { x: 50, y: 81 };
    baseSpeed.current += 0.1;
    speed.current = { x: baseSpeed.current, y: -baseSpeed.current };
    setLevel(prev => prev + 1);
    setBlocks(Array(5 + level * 2).fill(true));
    if (ballRef.current) {
      ballRef.current.style.left = `${ballPos.current.x}%`;
      ballRef.current.style.top = `${ballPos.current.y}%`;
    }
  };

  useEffect(() => {
    if (blocks.length > 0 && blocks.every(b => !b)) {
      nextLevel();
    }
  }, [blocks]);

  useEffect(() => {
    const gameLoop = () => {
      if (!isPlaying || !ballRef.current || !gamecontainerRef.current || !paddleRef.current) return;

      const ballRect = ballRef.current.getBoundingClientRect();
      const containerRect = gamecontainerRef.current.getBoundingClientRect();
      const paddleRect = paddleRef.current.getBoundingClientRect();
      if (ballRect.left <= containerRect.left) {
        speed.current.x = Math.abs(speed.current.x);
      } else if (ballRect.right >= containerRect.right) {
        speed.current.x = -Math.abs(speed.current.x);
      }
      if (ballRect.top <= containerRect.top) {
        speed.current.y = Math.abs(speed.current.y);
      }
      if (ballRect.bottom >= containerRect.bottom) {
        gameOver();
        return;
      }
      if (
        ballRect.bottom >= paddleRect.top &&
        ballRect.top <= paddleRect.bottom &&
        ballRect.right >= paddleRect.left &&
        ballRect.left <= paddleRect.right &&
        speed.current.y > 0
      ) {
        speed.current.y = -Math.abs(speed.current.y);
        const hitPoint = ballRect.left + ballRect.width / 2 - paddleRect.left;
        const paddleWidth = paddleRect.width;
        const hitFactor = (hitPoint / paddleWidth) - 0.5;
        speed.current.x = baseSpeed.current * 2 * hitFactor;
      }
      const blockElements = document.querySelectorAll('.block:not(.destroyed)');
      let hitBlock = false;
      
      blockElements.forEach((blockEl) => {
        if (hitBlock) return;
        
        const blockRect = blockEl.getBoundingClientRect();
        if (
          ballRect.bottom >= blockRect.top &&
          ballRect.top <= blockRect.bottom &&
          ballRect.right >= blockRect.left &&
          ballRect.left <= blockRect.right
        ) {
          hitBlock = true;
          const overlapLeft = ballRect.right - blockRect.left;
          const overlapRight = blockRect.right - ballRect.left;
          const overlapTop = ballRect.bottom - blockRect.top;
          const overlapBottom = blockRect.bottom - ballRect.top;
          
          const minOverlap = Math.min(Math.abs(overlapLeft), Math.abs(overlapRight), Math.abs(overlapTop), Math.abs(overlapBottom));
          
          if (minOverlap === Math.abs(overlapTop) || minOverlap === Math.abs(overlapBottom)) {
            speed.current.y = -speed.current.y;
          } else {
            speed.current.x = -speed.current.x;
          }
          const index = parseInt(blockEl.dataset.index, 10);
          setBlocks(prev => {
            if (!prev[index]) return prev;
            const newBlocks = [...prev];
            newBlocks[index] = false;
            return newBlocks;
          });
          setScore(s => s + 10);
        }
      });
      ballPos.current.x += speed.current.x;
      ballPos.current.y += speed.current.y;
      
      ballRef.current.style.left = `${ballPos.current.x}%`;
      ballRef.current.style.top = `${ballPos.current.y}%`;

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!gamecontainerRef.current || !paddleRef.current) return;
      const containerRect = gamecontainerRef.current.getBoundingClientRect();
      const paddleWidth = paddleRef.current.offsetWidth;
      let newLeft = e.clientX - containerRect.left - paddleWidth / 2;
      if (newLeft < 0) newLeft = 0;
      if (newLeft > containerRect.width - paddleWidth) newLeft = containerRect.width - paddleWidth;
      paddleRef.current.style.left = `${newLeft}px`;
    };

    const handleClick = () => {
      if (!isPlaying) {
        setIsPlaying(true);
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
    };
  }, [isPlaying]);

  return (
    <>
      <div className="settings"><span className="material-symbols-outlined menu">
menu
</span></div><header className='heading'>Block Busters</header>
<div className="score">Score: {score} | Level: {level}</div>
      <div className="game-container" ref={gamecontainerRef}>
        <div className="game">
          
          <div className="blocks">
            {blocks.map((isAlive, index) => (
              isAlive && <div className="block" key={index} data-index={index}></div>
            ))}
          </div>
          </div>
          <div className="paddle" ref={paddleRef}></div>
          <div className="ball" ref={ballRef} style={{ left: `${ballPos.current.x}%`, top: `${ballPos.current.y}%` }}></div>
        </div>
    </>
  )
}

export default App;
