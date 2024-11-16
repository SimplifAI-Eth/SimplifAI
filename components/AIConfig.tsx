import Image from "next/image";
import { FaArrowRightArrowLeft } from "react-icons/fa6";

interface AIConfigParams {
  tradeMin: number; // min price
  tradeMax: number; // max price
  orderType: string; // buy or sell
  quantity: number; // num to sell or buy
  transactionCount: number; // default to 3, count down
  lastTimeStampSinceTransaction: Date; // date of last transaction
}

const ETHLogo = "https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png";
const USDCLogo = "/usdc.svg";

const AIConfig = ({ config }: { config: AIConfigParams }) => {
  return (
    <>
      <div className="flex flex-col md:w-[33%] w-[80%] h-1/4 pt-2 pb-2 font-semibold backdrop-blur-sm card-gradient rounded-xl drop-shadow-lg hover:drop-shadow-2xl text-[#9d9d9d]">
        
        {/* top half */}
        <div className="flex w-full h-[50%]">
          {/* Token Swap thing */}
          <div className="flex gap-2 w-full h-full p-4">
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

          <div className="flex flex-col gap-3 w-full h-[50%] p-4">
            <p className="text-3xl text-white">{config.orderType == "BUY" ? "Buy" : "Sell"} ETH</p>
            <p className="text-2xl text-white">Range: {config.tradeMin} - {config.tradeMax} USDC</p>
          </div>
        </div>

        {/* bot half */}
        <div className="w-full h-fit flex-col items-center p-2 px-5 mt-2 gap-2">
          <p className="text-2xl text-white">Token Quantity: {config.quantity} ETH</p>
          <p className="text-2xl text-white">Order Completion:</p>
        </div>

      </div>
    </>
  );
};

export default AIConfig;


