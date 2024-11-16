"use client"

import ToggleNotification from "@/components/ToggleNotification";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";
import AIConfig from "@/components/AIConfig";
import MobileAIConfig from "@/components/MobileAIConfig";


const mockConfig = {
  tradeMin: 100,
  tradeMax: 3200,
  orderType: "BUY",
  quantity: 0.0001,
  transactionCount: 3,
  lastTimeStampSinceTransaction: new Date()
}

const Settings = () => {
  const { primaryWallet } = useDynamicContext();
  const [walletAddress, setWalletAddress] = useState("");
  const [connected, setConnected] = useState(false);
  const [aiSignal, setAISignal] = useState("");

  useEffect(() => {
    if (primaryWallet && !walletAddress) {
      setConnected(true);
      setWalletAddress(primaryWallet.address);
    }
  }, [primaryWallet]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/priceData", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      const {price, signal, timestamp} = data;
      console.log("gotten data:", data);
      setAISignal(data);
    };

    fetchData();

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
    <div className="h-full w-full pb-8 mb-16 flex">
      <div className="w-full h-screen flex-col flex items-center pb-8 mb-16">
        {/* <p>{data}</p> */}
        {connected && (
          <div className="w-full h-full p-4 md:flex flex-col gap-8 items-center hidden">
            <ToggleNotification connectedWallet={walletAddress} />
            <AIConfig config={mockConfig} />
          </div>
        )}
        {connected && (
          <div className="w-full h-full -mt-16 flex flex-col gap-8 items-center md:hidden">
            <ToggleNotification connectedWallet={walletAddress} />
            <MobileAIConfig config={mockConfig} />
          </div>
        )}
      </div>
    </div>
    </>
  )
}

export default Settings;