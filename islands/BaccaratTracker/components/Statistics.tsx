import { useEffect, useState } from 'preact/hooks';
import type { GameState } from '../../../utils/types.ts';

interface StatisticsProps {
	gameState: GameState;
	isDarkMode: boolean;
}

export function Statistics({ gameState, isDarkMode }: StatisticsProps) {
	const { wins, losses, ties, totalAmount, startTime } = gameState;
	const totalHands = wins + losses + ties;
	const winPercentage = totalHands > 0
		? Math.round((wins / (wins + losses)) * 100)
		: 0;

	const [elapsedTime, setElapsedTime] = useState<string>('00:00:00');

	useEffect(() => {
		const updateTimer = () => {
			const now = Date.now();
			const diff = Math.floor((now - startTime) / 1000); // Convert to seconds

			const hours = Math.floor(diff / 3600);
			const minutes = Math.floor((diff % 3600) / 60);
			const seconds = diff % 60;

			const timeString = [hours, minutes, seconds]
				.map((v) => v.toString().padStart(2, '0'))
				.join(':');

			setElapsedTime(timeString);
		};

		// Update immediately
		updateTimer();

		// Update every second
		const intervalId = setInterval(updateTimer, 1000);

		return () => clearInterval(intervalId);
	}, [startTime]);

	return (
		<div
			class={`grid grid-cols-4 gap-2 p-3 rounded-lg ${
				isDarkMode
					? 'bg-gray-800 border-gray-700'
					: 'bg-gray-100 border-gray-200'
			}`}
		>
			<div class='text-center'>
				<div class='text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400'>
					Play Time
				</div>
				<div class='text-base font-bold font-mono mt-0.5'>{elapsedTime}</div>
			</div>

			<div class='text-center'>
				<div class='text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400'>
					Total Hands
				</div>
				<div class='text-base font-bold mt-0.5'>{totalHands}</div>
			</div>

			<div class='text-center'>
				<div class='text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400'>
					Win Rate
				</div>
				<div
					class={`text-base font-bold mt-0.5 ${
						winPercentage >= 50
							? 'text-green-600 dark:text-green-400'
							: 'text-red-600 dark:text-red-400'
					}`}
				>
					{winPercentage}%
				</div>
			</div>

			<div class='text-center'>
				<div class='text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400'>
					Total Profit
				</div>
				<div
					class={`text-base font-bold mt-0.5 ${
						totalAmount >= 0
							? 'text-green-600 dark:text-green-400'
							: 'text-red-600 dark:text-red-400'
					}`}
				>
					${totalAmount.toFixed(2)}
				</div>
			</div>
		</div>
	);
}
