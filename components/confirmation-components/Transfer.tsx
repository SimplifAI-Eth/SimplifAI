import Image from "next/image";
import { FaArrowRight } from "react-icons/fa6";

type TransferCardProps = {
  receiverName: string;
  receiverWalletAddress: string;
  transferToken: any;
  transferAmount: number;
};

const TransferCard = ({
  receiverName,
  receiverWalletAddress,
  transferToken,
  transferAmount,
}: TransferCardProps) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full p-6 mb-1 font-semibold backdrop-blur-sm card-gradient rounded-xl text-[#9d9d9d]">
      <div className="flex flex-col w-full justify-center items-center">
        {/** Logos */}
        <div className="flex w-2/3 justify-around items-center m-2 sm:m-0">
          <div className="w-1/3 h-full ">
            <Image
              src={
                transferToken
                  ? transferToken.logoURI
                  : "https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png"
              }
              alt=""
              width={100}
              height={100}
            />
          </div>
          <div className="w-1/3 h-full flex justify-center">
            <FaArrowRight size={30} color={"#8c8c8c"} />
          </div>
          <div className="w-1/3 h-full">
            <Image
              src={`https://api.cloudnouns.com/v1/pfp?text=${receiverWalletAddress}`}
              alt=""
              width={100}
              height={100}
              className="rounded-full aspect-square"
            />
          </div>
        </div>

        {/** Details */}
        <div className="flex flex-col w-full h-full justify-center items-center m-3">
          <div>
            <h1 className="text-2xl font-light h6 tracking-wider pt-5">
              Transfer
            </h1>
          </div>
          <h1 className="text-[40px] text-white pb-8">{`${transferAmount.toString()} ${
            transferToken.symbol
          }`}</h1>
          {/* <div className="w-full flex flex-col bg-gray-800 rounded-t-xl p-4 mb-[2px]">
            <div className="flex justify-between pl-3 pr-3">
              <h1 className="text-xl font-light text-gray-400">To</h1>
              <h1 className="text-xl text-gray-100">{`${receiverName}`}</h1>
            </div>
          </div>
          <div className="w-full flex flex-col bg-gray-800 rounded-b-xl p-4">
            <div className="flex justify-between pl-3 pr-3">
              <h1 className="text-xl font-light text-gray-400">Address</h1>
              <h1 className="text-xl text-gray-100">{`${receiverWalletAddress.slice(
                0,
                5
              )}...${receiverWalletAddress.slice(-3)}`}</h1>
            </div>
          </div> */}
          <div
            className="w-full grid grid-cols-2 p-4 gap-3 text-lg"
            style={{ gridTemplateColumns: "1fr 2fr" }}
          >
            <div>
              <h1 className="text-white">To :</h1>
            </div>
            <div className="flex items-center justify-end">
              <h1 className="">{receiverName}</h1>
            </div>
            <div>
              <h1 className="text-white">Address :</h1>
            </div>
            <div className="flex items-center justify-end">
              <h1 className="">{`${receiverWalletAddress.slice(
                0,
                8
              )}...${receiverWalletAddress.slice(-4)}`}</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransferCard;
