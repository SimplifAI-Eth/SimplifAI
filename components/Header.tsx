"use client";

import { DynamicWallet } from "@/components/DynamicWallet";
import { useDynamicContext, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getUserByUserID } from "@/lib/db_actions/user-actions";

const Header = () => {
  const isLoggedIn = useIsLoggedIn();
  const { primaryWallet } = useDynamicContext();
  const [user, setUser] = useState<any>();

  const fetchUser = async (userID: string) => {
    const data = await getUserByUserID(userID);
    setUser(data);
  };

  useEffect(() => {
    if (isLoggedIn && primaryWallet) {
      console.log("wallet is", primaryWallet);
      // const user = fetchUser(primaryWallet.address);
      fetchUser(primaryWallet.address);
    }
  }, [isLoggedIn, primaryWallet]);

  useEffect(() => {
    console.log("user is", user);
  }, [user]);

  return (
    <>
      <div className="w-full h-full flex-col flex items-center gap-4">
        <div className="w-full h-[80%]">
          <Image
            src="/firewatch-gradient-slim.png"
            alt="header-img"
            width={2000}
            height={2000}
            style={{ objectFit: "cover" }}
            className="h-full w-full"
          />
        </div>{" "}
        {/* BG Image Placeholder */}
        <div className="w-1/3 md:w-1/12 -mt-24 mb-6 rounded-full aspect-square relative overflow-hidden p-20">
          <Image
            src={`https://api.cloudnouns.com/v1/pfp?text=${primaryWallet?.address}`}
            fill
            style={{ objectFit: "cover" }}
            alt=""
            className="rounded-full aspect-square"
          />
        </div>
        {/* Profile Picture Placeholder */}
        <DynamicWallet />
      </div>
    </>
  );
};

export default Header;
