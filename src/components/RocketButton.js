import React, { useRef, useEffect } from 'react';
import { debounce } from 'lodash';
import { ArrowUpCircleIcon } from '@heroicons/react/24/solid'

function RocketButton() {
  const rocketButtonRef = useRef(null);

  useEffect(() => {
    const handleScroll = debounce(() => {
      const isVisible = window.scrollY > 200;
      rocketButtonRef.current.classList.toggle('hidden', !isVisible);
    }, 100);

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <button
      ref={rocketButtonRef}
      className="fixed bottom-16 right-4 z-50"
      onClick={handleClick}
      aria-label="Scroll to top"
    >
      {/* Rocket SVG icon here */}
      <ArrowUpCircleIcon className="h-16 w-16 text-black" />
    </button>
  );
}

export default RocketButton;
