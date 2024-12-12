import { Card } from '../../../components/shared/Card.tsx';
import { HistoryCard } from './HistoryCard.tsx';
import type { GameAction } from '../../../utils/types.ts';

interface HistoryProps {
	history: GameAction[];
	isDarkMode: boolean;
	class?: string;
}

export function History({
	history,
	isDarkMode,
	class: className = '',
}: HistoryProps) {
	return (
		<div class={className}>
			<Card isDarkMode={isDarkMode} class='p-4 sticky top-4'>
				<h2 class='text-xl font-bold mb-4'>Hand History</h2>
				<div class='overflow-y-auto max-h-[calc(100vh-200px)] space-y-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent hover:scrollbar-thumb-gray-500'>
					{history.length === 0
						? (
							<div class='text-center text-gray-500 dark:text-gray-400 py-4'>
								No hands played yet
							</div>
						)
						: (
							history
								.slice()
								.reverse()
								.map((action, idx) => (
									<HistoryCard
										key={action.timestamp}
										action={action}
										index={history.length - 1 - idx}
										isDarkMode={isDarkMode}
									/>
								))
						)}
				</div>
			</Card>
		</div>
	);
}
