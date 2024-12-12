import { AppProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

export default function App({ Component }: AppProps) {
  return (
    <html>
      <Head>
        <title>Baccarat Strategy Tracker</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <body>
        <div id="theme-root" class="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
          <Component />
        </div>
      </body>
    </html>
  );
}