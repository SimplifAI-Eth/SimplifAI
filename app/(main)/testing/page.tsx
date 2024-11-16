"use client";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useState, useEffect } from "react";
import ToggleNotification from "@/components/ToggleNotification";
import { useWalletClient } from "wagmi";
import NotificationWidget from "@/components/NotificationWidget";
import MessageButton from "@/components/MessageButton";
import { Component } from "@/components/LineChart";
import RetriveNotificationButton from "@/components/RetriveNotificationButton";
import AddOrderTest from "@/components/AddOrderTest";
import { Line } from "recharts";
import LineChartPopUp from "@/components/LineChartPopUp";

export default function Home() {
  const { primaryWallet } = useDynamicContext();
  const [walletAddress, setWalletAddress] = useState("");
  const [connected, setConnected] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (primaryWallet && !walletAddress) {
      setConnected(true);
      setWalletAddress(primaryWallet.address);
    }
  }, [primaryWallet]);

  const mockTokenData = [
    { time: 1731657600, value: 3064.87819940756 },
    { time: 1731661200, value: 3098.209765686975 },
    { time: 1731664800, value: 3101.034674611459 },
    { time: 1731668400, value: 3098.9223628849 },
    { time: 1731672000, value: 3098.4006589559017 },
    { time: 1731675600, value: 3107.9047462492726 },
    { time: 1731679200, value: 3066.539621586942 },
    { time: 1731682800, value: 3021.6366859291 },
    { time: 1731686400, value: 3031.9917261297037 },
    { time: 1731690000, value: 3045.5529908425633 },
    { time: 1731693600, value: 3027.0947139755394 },
    { time: 1731697200, value: 3042.7279813808714 },
    { time: 1731700800, value: 3083.570071484961 },
    { time: 1731704400, value: 3089.216717868855 },
    { time: 1731708000, value: 3104.7951464197595 },
    { time: 1731711600, value: 3095.643199857981 },
    { time: 1731715200, value: 3080.969234276621 },
    { time: 1731718800, value: 3101.1760934188183 },
    { time: 1731722400, value: 3114.8228010306775 },
    { time: 1731726000, value: 3145.9553109618023 },
    { time: 1731729600, value: 3135.8846084431266 },
    { time: 1731733200, value: 3133.4981726554383 },
    { time: 1731736800, value: 3118.4911484177096 },
    { time: 1731740400, value: 3119.640831632943 }
  ];


  return (
    <>
      <div className="w-full h-screen flex-col flex items-center gap-4">
        {connected && (
          <div className="w-full h-fit p-4 flex flex-col gap-8 items-center justify-center">
            <ToggleNotification connectedWallet={walletAddress} />
            <MessageButton connectedWallet={walletAddress} />
            <RetriveNotificationButton connectedWallet={walletAddress} />
            <AddOrderTest />
            <button onClick={() => setIsOpen(true)}>Open Line Chart</button>
            {/* <LineChartPopUp isOpen={isOpen} setIsOpen={setIsOpen} /> */}
          </div>
        )}
        {/* <Component chartData={mockTokenData} /> */}
      </div>
    </>
  );
}
