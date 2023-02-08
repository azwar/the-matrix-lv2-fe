import { useEffect, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

export default function Profile() {
  const { address, isConnected, isConnecting } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const [connectionStat, setConnectionStat] = useState();
  const [addr, setAddr] = useState();

  useEffect(() => {
    setConnectionStat(isConnected);
    setAddr(address);
  }, [address, isConnected])

  if (connectionStat) {
    return (
      <div>
        <p>Connected to {addr}</p>
        {/* <button onClick={() => disconnect()}>Disconnect</button> */}
      </div>
    );
  }

  return (
    <div>
      ....
    </div>
  );
}
