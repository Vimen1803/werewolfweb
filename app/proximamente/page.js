'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProximamentePage() {
  const fullText = "WereWolf 2.0 próximamente...";
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const handleType = () => {
      if (isDeleting) {
        setDisplayedText((prev) => fullText.substring(0, prev.length - 1));
      } else {
        setDisplayedText((prev) => fullText.substring(0, prev.length + 1));
      }

      if (!isDeleting && displayedText === fullText) {
        timer = setTimeout(() => setIsDeleting(true), 2500);
      } else if (isDeleting && displayedText === "") {
        setIsDeleting(false);
      }
    };

    timer = setTimeout(handleType, isDeleting ? 40 : 85);
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting]);

  return (
    <main className="main-content page-pad coming-soon-canvas">
      <div className="coming-soon-wrapper fade-in">
        {/* Animated Typewriter Title */}
        <h1 className="typewriter-title">
          <span>{displayedText}</span>
          <span className="cursor-blink">|</span>
        </h1>

        <p className="coming-soon-sub">El nuevo bot de El Pueblo Duerme para tu servidor</p>

        {/* Looping Progress Bar (filling and emptying continuously) */}
        <div className="progress-bar-container">
          <div className="progress-bar-fill" />
        </div>

        {/* Square neutral button: Volver → */}
        <div className="coming-soon-cta">
          <Link href="/doc" className="clean-square-btn">
            <span>Volver →</span>
          </Link>
        </div>

        {/* Clean status note */}
        <div className="beta-status-note">
          Acceso privado restringido a servidores autorizados
        </div>
      </div>

      {/* Digital Pixel Matrix Pattern Bar */}
      <div className="pixel-matrix-bar">
        {Array.from({ length: 48 }).map((_, i) => (
          <div
            key={i}
            className="matrix-cell"
            style={{ animationDelay: `${(i % 12) * 0.15}s` }}
          />
        ))}
      </div>
    </main>
  );
}
