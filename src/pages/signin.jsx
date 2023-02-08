import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { InjectedConnector } from 'wagmi/connectors/injected'
import { signIn } from "next-auth/react";
import { useAccount, useConnect, useSignMessage, useDisconnect } from "wagmi";
import { useRouter } from "next/router";
import { useAuthRequestChallengeEvm } from "@moralisweb3/next";

function SignIn() {
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { requestChallengeAsync } = useAuthRequestChallengeEvm();
  const { push } = useRouter();

//   const { connect } = useConnect({
//     connector: new InjectedConnector(),
//   })
  const handleAuth = async () => {
    if (isConnected) {
      await disconnectAsync();
    }

    const { account, chain } = await connectAsync({
      connector: new InjectedConnector(),
    });

    const { message } = await requestChallengeAsync({
      address: account,
      chainId: chain.id,
    });

    const signature = await signMessageAsync({ message });

    // redirect user after success authentication to '/user' page
    const { url } = await signIn("moralis-auth", {
      message,
      signature,
      redirect: false,
      callbackUrl: "/matrix",
    });

    push(url);
  };

  return (
    <div>
      <h3>Web3 Authentication</h3>
      <button
        onClick={handleAuth}
        className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
      >
        Authenticate via Metamask
      </button>
      {/* <button className="b" onClick={handleAuth}>Authenticate via Metamask</button> */}
    </div>
  );
}

export default SignIn;
