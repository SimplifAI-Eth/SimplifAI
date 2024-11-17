"use client";

import ToggleNotification from "@/components/ToggleNotification";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useEffect, useState } from "react";
import AIConfig from "@/components/AIConfig";
import MobileAIConfig from "@/components/MobileAIConfig";
import { addOrdertoOrderBook, getUserByUserID, reduceTransactionCount } from "@/lib/db_actions/user-actions";
import { set } from "mongoose";

const mockConfig = {
  tradeMin: 100,
  tradeMax: 3200,
  orderType: "BUY",
  quantity: 0.0001,
  transactionCount: 3,
  lastTimeStampSinceTransaction: new Date(),
};

const Settings = () => {
  const { primaryWallet } = useDynamicContext();
  const [walletAddress, setWalletAddress] = useState("");
  const [connected, setConnected] = useState(false);
  const [aiSignal, setAISignal] = useState("");
  const [AIConfigs, setAIConfigs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function swapLogic(walletAddress: string, price: string) {
    const user = await getUserByUserID(walletAddress);
    const orderBook = user.orderBook;

    for (const order of orderBook) {
      if (order.tradeMin <= price && order.tradeMax >= price) {
        // init swap here
        console.log("Initiated")
        await reduceTransactionCount({userID: walletAddress, orderID: order.orderID})
      }
    }
  }

  useEffect(() => {
    const fetchUser = async (walletAddress: string) => {
      const user = await getUserByUserID(walletAddress);
      setAIConfigs(user.orderBook);
    };

    if (primaryWallet && !walletAddress) {
      setConnected(true);
      setWalletAddress(primaryWallet.address);

      fetchUser(primaryWallet.address);
      setLoading(false);
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
      const { price, signal, timestamp } = data;
      console.log("gotten data:", data);
      setAISignal(data);
      swapLogic(walletAddress, price)
    };

    fetchData();

    const interval = setInterval(fetchData, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-full w-full pb-16 mb-24 flex">
      <div className="w-full h-full flex-col flex items-center pb-8 mb-16">
        {connected && !loading && (
          <div className="w-full h-full p-4 md:flex flex-col gap-8 items-center hidden">
            <ToggleNotification connectedWallet={walletAddress} />
            {AIConfigs.map((config, index) => (
              <AIConfig key={index} config={config} />
            ))}
          </div>
        )}
        {loading && <p>Loading AI configuration</p>}
        {connected && !loading && (
          <div className="w-full h-full -mt-16 flex flex-col gap-8 items-center md:hidden">
            <ToggleNotification connectedWallet={walletAddress} />
            {AIConfigs.map((config, index) => (
              <MobileAIConfig key={index} config={config} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
