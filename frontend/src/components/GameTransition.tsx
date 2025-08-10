"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface GameTransitionProps {
  onComplete: () => void;
  type: 'restart' | 'mode-change';
}

const GameTransition = ({ onComplete, type }: GameTransitionProps) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (overlayRef.current) {
      const tl = gsap.timeline({
        onComplete: onComplete
      });

      tl.fromTo(overlayRef.current, {
        opacity: 0,
        scale: 0
      }, {
        opacity: 1,
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      })
      .to(overlayRef.current, {
        opacity: 0,
        scale: 1.2,
        duration: 0.3,
        ease: "power2.in",
        delay: 0.2
      });
    }
  }, [onComplete]);

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-2xl">
        <p className="text-xl font-bold text-center">
          {type === 'restart' ? 'Restarting Game...' : 'Changing Mode...'}
        </p>
      </div>
    </div>
  );
};

export default GameTransition;