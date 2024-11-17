import Image from "next/image";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import BarPercentage from "./BarPercentage";

interface AIConfigParams {
  tradeMin: number; // min price
  tradeMax: number; // max price
  orderType: string; // buy or sell
  quantity: number; // num to sell or buy
  transactionCount: number; // default to 3, count down
  lastTimeStampSinceTransaction: Date; // date of last transaction
}

const ETHLogo =
  "https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png";
const USDCLogo = "/usdc.svg";

const AIConfig = ({ config }: { config: AIConfigParams }) => {
  return (
    <>
      <div className="flex flex-col md:w-1/4 w-[80%] h-2/5 pt-2 pb-2 font-semibold backdrop-blur-sm card-gradient rounded-xl drop-shadow-lg hover:drop-shadow-2xl text-[#6e6e6e] p-4">
        {/* top half */}
        <div className="w-full flex justify-center items-center mt-5">
          <p className="text-3xl text-white">
            {config.orderType == "BUY" ? "Buy" : "Sell"} ETH
          </p>
        </div>
        {/* Token Swap thing */}
        <div className="flex justify-center items-center w-full h-full">
          <div className="flex gap-2 h-[12vh] p-4">
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

        {/* <p className="text-3xl text-white">{config.orderType == "BUY" ? "Buy" : "Sell"} ETH</p> */}
        <div className="grid grid-cols-2 gap-2 px-3">
          <p className="text-xl text-white">Range :</p>
          <p className="text-xl flex justify-end">
            {" "}
            {config.tradeMin} - {config.tradeMax}
            USDC
          </p>
          <p className="text-xl text-white">Token Quantity:</p>
          <p className="text-xl flex justify-end">{config.quantity} ETH</p>
        </div>
        <p className="text-xl mt-2 pl-3 mb-2 text-white">Order Completion:</p>
        <BarPercentage
          barPercentage={(Math.abs(config.transactionCount - 3) * 100) / 3}
          option=""
        />
      </div>

      {/* bot half */}
    </>
  );
};

export default AIConfig;
