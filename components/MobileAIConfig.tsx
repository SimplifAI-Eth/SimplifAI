import Image from "next/image";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import BarPercentage from "./BarPercentage";

interface MobileAIConfigParams {
  tradeMin: number; // min price
  tradeMax: number; // max price
  orderType: string; // buy or sell
  quantity: number; // num to sell or buy
  transactionCount: number; // default to 3, count down
  lastTimeStampSinceTransaction: Date; // date of last transaction
}

const ETHLogo = "https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png";
const USDCLogo = "/usdc.svg";

const MobileAIConfig = ({ config }: { config: MobileAIConfigParams }) => {
  return (
    <>
      <div className="flex flex-col w-[80%] h-1/3 pt-2 pb-2 font-semibold backdrop-blur-sm card-gradient rounded-xl drop-shadow-lg hover:drop-shadow-2xl text-[#9d9d9d]">
        
        {/* top half */}
        <div className="flex w-full h-[30%]">
          {/* Token Swap thing */}
          <div className="flex gap-2 w-full h-full p-4 items-center justify-center">
            <div className="h-full w-fit flex aspect-square relative">
              <Image
                src={ETHLogo}
                fill
                style={{ objectFit: "contain" }}
                alt="token"
                className=""
                />
            </div>
              <div className="h-full w-fit flex aspect-square relative items-center justify-center text-white text-4xl">
              <FaArrowRightArrowLeft />
              </div>
            <div className="h-full w-fit flex aspect-square relative">
            <Image
              src={USDCLogo}
              fill
              style={{ objectFit: "contain" }}
              alt="token"
              className=""
              />
            </div>
          </div>
        </div>

        {/* bot half */}
        <div className="w-full h-fit flex-col p-2 px-5 gap-2 flex">
          <p className="text-md text-white">{config.orderType == "BUY" ? "Buy" : "Sell"} ETH</p>
          <p className="text-md text-white">Range: {config.tradeMin} - {config.tradeMax} USDC</p>
          <p className="text-md text-white">Token Quantity: {config.quantity} ETH</p>
          <p className="text-md text-white">Order Completion:</p>
          <BarPercentage barPercentage={Math.abs(config.transactionCount - 3) * 100 / 3} option="" />
        </div>

      </div>
    </>
  );
};

export default MobileAIConfig;


