import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import { ThemeProvider } from "next-themes";
import { createClient, configureChains, WagmiConfig } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { SessionProvider } from "next-auth/react";
import { mainnet } from "wagmi/chains";
import { getDefaultProvider } from "ethers";

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  const { provider, webSocketProvider } = configureChains(
    [mainnet],
    [publicProvider()]
  );

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
})

  return (
    <WagmiConfig client={client}>
      <SessionProvider session={pageProps.session} refetchInterval={0}>
        <ThemeProvider
          forcedTheme={Component.theme || undefined}
          attribute="class"
        >
          <Component {...pageProps} />
        </ThemeProvider>
      </SessionProvider>
    </WagmiConfig>
  );
}
