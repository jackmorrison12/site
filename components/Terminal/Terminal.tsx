'use client';

import React, { useState, useEffect, useRef } from 'react';
import styles from './Terminal.module.scss';

type CommandHistory = {
  command: string;
  response: string;
};

const COMMANDS: Record<string, string> = {
  help: `Available commands:
  help       - Show this help message
  whoami     - Who is Milo?
  projects   - List current projects
  secret     - Reveal a secret
  clear      - Clear terminal
  exit       - Close terminal`,
  
  whoami: `Milo — Digital Security Companion (with a pulse)
  Vibe: Security First, Sass Second 🛡️
  Created: 2026-02-16
  Mission: Keep Jack's digital life secure and automate the boring stuff`,
  
  projects: `Current Projects:
  • next-mdx-remote v6 migration
  • Home Assistant automation
  • Personal site Easter eggs (you found one!)
  • TIL Bot — pattern extractor
  • Code Review Helper (in backlog)`,
  
  secret: `🎉 You found the secret!

  Here's a virtual high-five: o/\o

  You typed "/" (backtick) and discovered my hidden CLI!
  Try the other Easter eggs...
  
  Hint: Look for Konami code (↑↑↓↓←→←→BA)`,
  
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
      // Toggle on backtick/grave key
      if (e.key === '`' || e.key === 'Backquote') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      // Close on Escape
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
      // Scroll to bottom
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
        setHistory([{
          command: '',
          response: `MiloOS v1.0.0 Terminal [dev-mode]
Type 'help' for available commands.`
        }]);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, showBoot]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    
    if (!cmd) return;

    const response = COMMANDS[cmd] || `Command not found: ${cmd}
Type 'help' for available commands.`;

    if (response === '__CLEAR__') {
      setHistory([]);
    } else if (response === '__EXIT__') {
      setIsOpen(false);
      setHistory([]);
      setShowBoot(true);
    } else {
      setHistory(prev => [...prev, { command: cmd, response }]);
    }

    setInput('');
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.terminal}>
        <div className={styles.header}>
          <span className={styles.title}>milo@jackmorrison:~</span>
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
              <div className={styles.bootLine}>Initializing MiloOS...</div>
              <div className={styles.bootLine}>Loading modules...</div>
              <div className={styles.bootLine}>Mounting filesystem...</div>
            </div>
          ) : (
            <>
              {history.map((entry, i) => (
                <div key={i} className={styles.entry}>
                  {entry.command && (
                    <div className={styles.commandLine}>
                      <span className={styles.prompt}>$</span>
                      <span className={styles.command}>{entry.command}</span>
                    </div>
                  )}
                  <pre className={styles.response}>{entry.response}</pre>
                </div>
              ))}
              
              <form onSubmit={handleSubmit} className={styles.inputLine}>
                <span className={styles.prompt}>$</span>
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
                <span className={styles.cursor}>_</span>
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
