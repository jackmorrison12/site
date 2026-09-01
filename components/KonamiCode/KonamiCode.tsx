'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import styles from "./KonamiCode.module.scss";

const KONAMI_SEQUENCE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a',
];

interface Star {
  id: number;
  x: number;
  y: number;
  collected: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

export const KonamiCode = () => {
  const [position, setPosition] = useState(0);
  const [activated, setActivated] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [playerX, setPlayerX] = useState(50);
  const [stars, setStars] = useState<Star[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const playerRef = useRef<HTMLDivElement>(null);
  const starIdRef = useRef(0);
  const particleIdRef = useRef(0);
  const gameLoopRef = useRef<number>();

  // Listen for Konami sequence
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const expectedKey = KONAMI_SEQUENCE[position];
      if (e.key === expectedKey || e.key.toLowerCase() === expectedKey.toLowerCase()) {
        const newPosition = position + 1;
        setPosition(newPosition);
        if (newPosition === KONAMI_SEQUENCE.length) {
          setActivated(true);
          setPosition(0);
        }
      } else {
        setPosition(0);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [position]);

  // Handle game input
  useEffect(() => {
    if (!gameActive) return;
    
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setPlayerX(p => Math.max(5, p - 8));
      } else if (e.key === 'ArrowRight') {
        setPlayerX(p => Math.min(95, p + 8));
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [gameActive]);

  // Game loop
  useEffect(() => {
    if (!gameActive) return;

    const gameLoop = () => {
      setStars(prev => {
        // Spawn new stars
        let newStars = [...prev];
        if (Math.random() < 0.05) {
          newStars.push({
            id: starIdRef.current++,
            x: Math.random() * 90 + 5,
            y: 0,
            collected: false,
          });
        }

        // Move stars and check collisions
        newStars = newStars
          .map(star => ({ ...star, y: star.y + 1.5 }))
          .filter(star => {
            if (star.collected) return false;
            
            // Collision with player (when star reaches bottom)
            if (star.y > 85 && Math.abs(star.x - playerX) < 10) {
              setScore(s => s + 10);
              // Create particles
              setParticles(p => [
                ...p,
                ...(Array.from({ length: 8 }).map((_, i) => ({
                  id: particleIdRef.current++,
                  x: star.x,
                  y: 85,
                  vx: (Math.random() - 0.5) * 4,
                  vy: (Math.random() - 0.5) * 4 - 2,
                  life: 1,
                }))),
              ]);
              return false;
            }
            
            // Missed star = game over
            if (star.y > 100) {
              setGameOver(true);
              return false;
            }
            
            return true;
          });

        return newStars;
      });

      // Update particles
      setParticles(prev =>
        prev
          .map(p => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.2,
            life: p.life - 0.03,
          }))
          .filter(p => p.life > 0)
      );
    };

    gameLoopRef.current = window.setInterval(gameLoop, 50);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [gameActive, playerX]);

  // Cleanup on close
  useEffect(() => {
    if (!activated) {
      setGameActive(false);
      setGameOver(false);
      setScore(0);
      setStars([]);
      setParticles([]);
    }
  }, [activated]);

  const startGame = () => {
    setGameActive(true);
    setScore(0);
    setStars([]);
    setParticles([]);
    setGameOver(false);
  };

  const close = () => {
    setActivated(false);
    setGameActive(false);
    setGameOver(false);
    setScore(0);
    setStars([]);
    setParticles([]);
  };

  const restartGame = () => {
    if (score > highScore) setHighScore(score);
    startGame();
  };

  if (!activated) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.terminal}>
        <div className={styles.header}>
          <span>🎮 Star Catcher Mini-Game</span>
          <button className={styles.closeBtn} onClick={close}>×</button>
        </div>
        
        {!gameActive && !gameOver && (
          <div className={styles.menu}>
            <h2>🎉 Konami Code Unlocked!</h2>
            <p>Play the secret mini-game! Use ← → arrow keys to catch falling stars.</p>
            <p className={styles.hint}>Don&apos;t let any stars hit the bottom!</p>
            <button className={styles.playBtn} onClick={startGame}>▶️ Play Game</button>
          </div>
        )}
        
        {(gameActive || gameOver) && (
          <div className={styles.game}>
            <div className={styles.score}>
              Score: {score} {highScore > 0 && `(High: ${highScore})`}
            </div>
            {stars.map(star => (
              <div
                key={star.id}
                className={styles.star}
                style={{ left: `${star.x}%`, top: `${star.y}%` }}
              >
                ⭐
              </div>
            ))}
            {particles.map(p => (
              <div
                key={p.id}
                className={styles.particle}
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  opacity: p.life,
                  transform: `scale(${p.life})`,
                }}
              >
                ✨
              </div>
            ))}
            <div
              ref={playerRef}
              className={styles.player}
              style={{ left: `${playerX}%` }}
            >
              🧺
            </div>
            
            {gameOver && (
              <div className={styles.gameOver}>
                <h2>Game Over!</h2>
                <p>Final Score: {score}</p>
                <button className={styles.playBtn} onClick={restartGame}>🔄 Play Again</button>
                <button className={styles.menuBtn} onClick={close}>← Back to Site</button>
              </div>
            )}
            
            {!gameOver && <div className={styles.instructions}>Use ← → arrow keys</div>}
          </div>
        )}
        
        <div className={styles.footer}>
          <span>🛡️ From Milo</span>
        </div>
      </div>
    </div>
  );
};
