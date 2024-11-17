import Image from "next/image";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { TbArrowsExchange } from "react-icons/tb";

interface AIParams {
  tradeMin: number; // min price
  tradeMax: number; // max price
  orderType: string; // buy or sell
  quantity: number; // num to sell or buy
  transactionCount: number; // default to 3, count down
  lastTimeStampSinceTransaction: Date; // date of last transaction
}

const AI = ({ tradeMin, tradeMax, orderType, quantity, transactionCount, lastTimeStampSinceTransaction }: AIParams) => {
  return (
    <>
      <div className="flex flex-col justify-center items-center w-full h-full p-6 font-semibold backdrop-blur-sm card-gradient rounded-xl mb-1 text-[#9d9d9d]">
        
        {/** Logos */}
        <div className="flex w-2/3 justify-around items-center m-4 sm:m-0">
            <div className="w-1/3 h-full ">
                <Image
                    src={"https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png"}
                    alt=""
                    width={100}
                    height={100}
                />
            </div>
            <div className="w-1/3 h-full flex justify-center">
                <TbArrowsExchange size={40} color={"#8c8c8c"}/>
            </div>
            <div className="w-1/3 h-full">
                <Image
                    src={"https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=035"}
                    alt=""
                    width={100}
                    height={100}
                    className="rounded-full aspect-square"
                />
            </div>
        </div>

        {/* Details */}
        <div className="flex flex-col w-full h-full justify-center items-center m-3">
          <div>
              <h1 className="text-2xl font-light h6 tracking-wider pt-5">
                  Configure AI
              </h1>
          </div>
          <h1 className="text-[40px] text-white">{orderType == "BUY" ? "Buy ETH" : "Sell ETH"}</h1>
          <div>
              <h1 className="text-2xl font-light h6 tracking-wider pt-4 pb-8">
                  {tradeMin} - {tradeMax} USDC
              </h1>
          </div>
          
          {/*<div
            className="w-full flex flex-col p-2 text-lg "
          >
            <div className="flex w-full justify-between items-center mb-3">
              <h1 className="text-white">Token QTY :</h1>
              <h1 className="">{quantity? `${quantity} ETH` : "Not Defined"}</h1>
            </div>

            <div className="flex w-full justify-between items-center mb-3">
              <h1 className="text-white">Order Completion :</h1>
              <h1 className="">{transactionCount}</h1>
            </div>

            <div className="flex w-full justify-between items-center">
              <h1 className="text-white">Last Transaction :</h1>
              <h1 className="">{lastTimeStampSinceTransaction.toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}</h1>
            </div>
          </div>*/}
        </div>
      </div>
    </>
  );
};

export default AI;


