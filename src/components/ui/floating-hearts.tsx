'use client';

import React, { useMemo } from 'react';

export function FloatingHearts() {
  const hearts = useMemo(() => [
    { left: '5%', top: '10%', size: '20px', delay: '0s', duration: '8s' },
    { left: '15%', top: '40%', size: '30px', delay: '2s', duration: '12s' },
    { left: '85%', top: '15%', size: '25px', delay: '1s', duration: '10s' },
    { left: '75%', top: '65%', size: '35px', delay: '3s', duration: '15s' },
    { left: '10%', top: '80%', size: '22px', delay: '4s', duration: '9s' },
    { left: '90%', top: '50%', size: '28px', delay: '1.5s', duration: '11s' },
    { left: '50%', top: '5%', size: '24px', delay: '2.5s', duration: '13s' },
    { left: '45%', top: '90%', size: '32px', delay: '0.5s', duration: '14s' },
    { left: '30%', top: '25%', size: '18px', delay: '5s', duration: '7s' },
    { left: '60%', top: '85%', size: '26px', delay: '1s', duration: '11s' },
  ], []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((h, i) => (
        <span
          key={i}
          className="absolute opacity-20 blur-[2px] animate-float-up-down select-none"
          style={{
            left: h.left,
            top: h.top,
            fontSize: h.size,
            animationDelay: h.delay,
            animationDuration: h.duration,
          }}
        >
          ❤️
        </span>
      ))}
    </div>
  );
}
