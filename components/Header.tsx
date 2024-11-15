"use client";

import { DynamicWallet } from "@/components/DynamicWallet";
import { useDynamicContext, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import Image from "next/image";
import { useEffect } from "react";
// import { getUserbyWalletAddress } from "@/lib/db_actions/user-actions";

const Header = () => {

  const isLoggedIn = useIsLoggedIn();
  const { primaryWallet } = useDynamicContext();

  // const fetchUser = async (walletAddress: string) => {
  //   return await getUserbyWalletAddress(walletAddress);
  // }

  // useEffect(() => {
  //   if (isLoggedIn && primaryWallet) {
  //     console.log("wallet is", primaryWallet);
  //     const user = fetchUser(primaryWallet.address);
  //     console.log("logged user is :", user);
  //   }
  // }, [isLoggedIn, primaryWallet])

  return (
    <>
      <div className="w-full h-full flex-col flex items-center gap-4">
        <div className="w-full h-[80%] bg-red-500"></div> {/* BG Image Placeholder */}
        <div className="w-1/3 md:w-1/12 bg-blue-500 -mt-24 rounded-full aspect-square relative overflow-hidden p-16">
          <Image src={`https://api.cloudnouns.com/v1/pfp?text=${primaryWallet?.address}`} 
          fill 
          style={{objectFit:"cover"}} 
          alt="" 
          className="absolute rounded-full aspect-square"
          />
        </div>{/* Profile Picture Placeholder */}
        <DynamicWallet />
      </div>
    </>
  );
};

export default Header;
