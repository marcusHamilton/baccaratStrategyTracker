import { useState } from 'preact/hooks';
import type { GameState } from '../../../utils/types.ts';
import { BETTING_PATTERN } from '../../../utils/constants.ts';

interface GameControlsProps {
	gameState: GameState;
	onWin: () => void;
	onLose: () => void;
	onTie: () => void;
	onUndo: () => void;
	onRedo: () => void;
	canUndo: boolean;
	canRedo: boolean;
}

export function GameControls({
	gameState,
	onWin,
	onLose,
	onTie,
	onUndo,
	onRedo,
	canUndo,
	canRedo,
}: GameControlsProps) {
	const { currentBet, currentPatternIndex } = gameState;
	const currentPosition = BETTING_PATTERN[currentPatternIndex];
	const isPlayerBet = currentPosition.position === 'Player';

	const [activeButton, setActiveButton] = useState<string | null>(null);

	const handleButtonClick = (callback: () => void, button: string) => {
		setActiveButton(button);
		callback();
		setTimeout(() => setActiveButton(null), 200); // Reset button after 200ms
	};

	const handlePlayerWon = () => {
		if (isPlayerBet) {
			onWin();
		} else {
			onLose();
		}
	};

	const handleBankerWon = () => {
		if (isPlayerBet) {
			onLose();
		} else {
			onWin();
		}
	};

	return (
		<div class='space-y-6'>
			{/* Betting position display */}
			<div class='text-center space-y-2 pb-8'>
				<div
					class={`p-4 rounded-xl border-2 ${
						isPlayerBet
							? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500'
							: 'bg-red-50 dark:bg-red-900/30 border-red-500'
					}`}
				>
					<div class='text-base uppercase tracking-wide text-gray-600 dark:text-gray-400 mb-1'>
						Current Bet:
					</div>
					<div class='flex items-center justify-center gap-3'>
                        <span class='text-2xl font-bold text-green-600 dark:text-green-400'>
						    ${currentBet}
					    </span>
						<span
							class={`text-2xl font-bold ${
								isPlayerBet
									? 'text-blue-600 dark:text-blue-400'
									: 'text-red-600 dark:text-red-400'
							}`}
						>
						→  {currentPosition.position} <span class='text-2xl'>{isPlayerBet ? '🧍' : ' 🏦'}</span>

						</span>
					</div>
				</div>
			</div>

			{/* Result buttons */}
			<div class='grid grid-cols-1 gap-4'>
				<button
					onClick={() => handleButtonClick(handlePlayerWon, 'player')}
					class={`p-4 rounded-xl text-xl font-bold bg-blue-500 hover:bg-blue-600 text-white 
              transition-all duration-100 transform ${
						activeButton === 'player' ? 'scale-95' : ''
					} relative`}
				>
					<span class='text-3xl'>🧍</span>
					Player Won
					{isPlayerBet && (
						<span class='absolute right-4 top-1/2 -translate-y-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md flex items-center justify-center'>
							Your Bet
						</span>
					)}
				</button>

				<button
					onClick={() => handleButtonClick(handleBankerWon, 'banker')}
					class={`p-4 rounded-xl text-xl font-bold bg-red-500 hover:bg-red-600 text-white 
              transition-all duration-100 transform ${
						activeButton === 'banker' ? 'scale-95' : ''
					} relative`}
				>
					<span class='text-3xl'>🏦  </span>
					Banker Won
					{!isPlayerBet && (
						<span class='absolute right-4 top-1/2 -translate-y-1/2 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md flex items-center justify-center'>
							Your Bet
						</span>
					)}
				</button>

				<button
					onClick={() => handleButtonClick(onTie, 'tie')}
					class={`p-4 rounded-xl text-lg font-bold bg-yellow-600 hover:bg-yellow-700 text-white 
              transition-all duration-100 transform ${
						activeButton === 'tie' ? 'scale-95' : ''
					}`}
				>
					<span class='text-2xl'>🤝  </span>
					Tie Game
				</button>
			</div>

			<div class='flex justify-center gap-4'>
				<button
					onClick={onUndo}
					disabled={!canUndo}
					class={`px-4 py-2 rounded-lg text-white transition-all duration-300 
            ${
						canUndo
							? 'bg-gray-600 hover:bg-gray-700'
							: 'bg-gray-400 cursor-not-allowed opacity-50'
					}`}
				>
					↩ Undo
				</button>
				<button
					onClick={onRedo}
					disabled={!canRedo}
					class={`px-4 py-2 rounded-lg text-white transition-all duration-300 
            ${
						canRedo
							? 'bg-gray-600 hover:bg-gray-700'
							: 'bg-gray-400 cursor-not-allowed opacity-50'
					}`}
				>
					Redo ↪
				</button>
			</div>
		</div>
	);
}
