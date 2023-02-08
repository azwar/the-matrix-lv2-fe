import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useAccount, useDisconnect } from "wagmi";

export default function SimpleAuthorizer() {
  const router = useRouter();
  const { disconnectAsync } = useDisconnect();
  const { address, isConnected, isConnecting } = useAccount();

  useEffect(() => {
    localStorage.removeItem("address");
    localStorage.removeItem("token");
    router.push("/login");
  }, []);

  return <div></div>;
}
