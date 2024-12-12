import { PageProps } from '$fresh/server.ts';

export default function Layout({ Component }: PageProps) {
	return (
		<div
			id='theme-root'
			class='min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300'
		>
			<Component />
		</div>
	);
}
