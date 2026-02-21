'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './Terminal.module.scss';

type CommandHistory = {
  command: string;
  response: string;
};

const COMMANDS: Record<string, string> = {
  help: `Available commands:
  help      - Show this help message
  whoami    - About Jack
  projects  - List active projects
  contact   - Get in touch
  now       - Current status
  clear     - Clear terminal
  exit      - Close terminal`,

  whoami: `Jack Morrison
──────────────────────────────────────
Software Engineer at Bloomberg
BSc Computing from Imperial College London
Based in London, UK

Passions: Home automation, skydiving, open source,
building things that make life easier.

Type 'projects' to see what I'm working on.`,

  projects: `Active Projects:
──────────────────────────────────────
• Personal site (jackmorrison.me) - Next.js, MDX, fun Easter eggs
• Osti - PDF annotation tool with friends
• Canvas - University coursework social platform
• Home Assistant automation - Making my flat smarter
• Skydiving log - Tracking jumps and progression

Check them out at /projects`,

  contact: `Get in Touch:
──────────────────────────────────────
• Twitter: @jsm_99
• GitHub: github.com/jackmorrison12
• LinkedIn: jackmorrison12
• Email: Available on request (type 'projects' for more)`,

  now: `Current Status:
──────────────────────────────────────
▶ Working on: Personal site improvements
▶ Listening to: Check /feed/lastfm
▶ Current obsession: Home Assistant automations
▶ Recently: Added fun Easter eggs to this site
▶ Next: More 3D visualizations and data viz`,

  secret: `🎉 Secret Unlocked!
──────────────────────────────────────
You found the hidden terminal!

Other things to try:
• Konami code (↑↑↓↓←→←→BA)
• Hover effects on social icons
• Type 'help' for more commands here

Happy exploring!`,

  clear: '__CLEAR__',
  exit: '__EXIT__',
};

export const Terminal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<CommandHistory[]>([]);
  const [showBoot, setShowBoot] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  // Listen for backtick key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`' || e.key === 'Backquote') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }
  }, [isOpen, history]);

  // Boot sequence
  useEffect(() => {
    if (isOpen && showBoot) {
      const timer = setTimeout(() => {
        setShowBoot(false);
        setHistory([
          {
            command: '',
            response: `jackmorrison.me terminal v1.0.0\nType 'help' for available commands.`,
          },
        ]);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [isOpen, showBoot]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    const response =
      COMMANDS[cmd] ||
      `Command not found: ${cmd}\nType 'help' for available commands.`;

    if (response === '__CLEAR__') {
      setHistory([]);
    } else if (response === '__EXIT__') {
      setIsOpen(false);
      setHistory([]);
      setShowBoot(true);
    } else {
      setHistory((prev) => [...prev, { command: cmd, response }]);
    }
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.terminal}>
        <div className={styles.header}>
          <span className={styles.title}>jack@terminal:~</span>
          <button
            className={styles.closeBtn}
            onClick={() => {
              setIsOpen(false);
              setHistory([]);
              setShowBoot(true);
            }}
          >
            ×
          </button>
        </div>
        <div className={styles.content} ref={terminalRef}>
          {showBoot ? (
            <div className={styles.bootSequence}>
              <div className={styles.bootLine}>Initializing...</div>
            </div>
          ) : (
            <>
              {history.map((entry, i) => (
                <div key={i} className={styles.entry}>
                  {entry.command && (
                    <div className={styles.commandLine}>
                      <span className={styles.prompt}>❯</span>
                      <span className={styles.command}>{entry.command}</span>
                    </div>
                  )}
                  <pre className={styles.response}>{entry.response}</pre>
                </div>
              ))}
              <form onSubmit={handleSubmit} className={styles.inputLine}>
                <span className={styles.prompt}>❯</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className={styles.input}
                  placeholder="Type command..."
                  spellCheck={false}
                  autoComplete="off"
                />
              </form>
            </>
          )}
        </div>
        <div className={styles.hint}>
          Press ` (backtick) to toggle • Escape to close
        </div>
      </div>
    </div>
  );
};
