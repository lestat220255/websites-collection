import { useEffect, useRef } from 'react';
import { ArrowUpIcon } from '@heroicons/react/24/solid';

function RocketButton() {
	const btnRef = useRef(null);

	useEffect(() => {
		let timer = null;
		const handleScroll = () => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				if (btnRef.current) {
					btnRef.current.classList.toggle('hidden', window.scrollY <= 200);
				}
			}, 100);
		};
		window.addEventListener('scroll', handleScroll, { passive: true });
		handleScroll();
		return () => {
			window.removeEventListener('scroll', handleScroll);
			clearTimeout(timer);
		};
	}, []);

	return (
		<button
			ref={btnRef}
			onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
			aria-label="Back to top"
			className="pixel-corners fixed bottom-6 right-6 z-50 hidden h-12 w-12 border-2 border-neon bg-panel text-neon transition-colors hover:bg-neon hover:text-void hover:shadow-[0_0_20px_rgba(0,240,255,0.5)]"
		>
			<ArrowUpIcon className="mx-auto h-6 w-6" />
		</button>
	);
}

export default RocketButton;
