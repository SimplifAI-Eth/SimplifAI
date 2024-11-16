import Image from "next/image";
import { TokenInformation } from "@/types/index";
import { useEffect, useState } from "react";
import { useChainId, useReadContract } from "wagmi";
import { ERC20ABI } from "@/utils/abi";
import { responseCookiesToRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { getTokenInformations } from "@/utils/oneinch";
import { tokenList } from "@/utils/tokenList";

type PortfolioCardProps = {
  portfolio: TokenInformation;
  setTokenAddress: React.Dispatch<React.SetStateAction<string>>;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const PortfolioCard = ({ portfolio, setTokenAddress }: PortfolioCardProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const chainId = useChainId();
  const result = useReadContract({
    abi: ERC20ABI,
    address: portfolio.contract_address as any,
    functionName: "symbol",
  });

  async function searchPortfolio() {
    if (
      chainId == 137 &&
      portfolio.contract_address == "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"
    ) {
      portfolio.tokenName = "Matic";
      portfolio.tokenSymbol = "MATIC";
      portfolio.tokenLogo =
        "https://tokens.1inch.io/0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0.png";
    }
    if (!portfolio.tokenName) {
      await delay(4000);
      portfolio.tokenSymbol = result.data;

      if (result) {
        const matchedToken = tokenList.find(
          (item) => item.symbol === result.data
        );
        console.log("Matching Token", matchedToken);
        if (!matchedToken) {
          return;
        }
        if (matchedToken) {
          portfolio.tokenLogo = matchedToken.logoURI;
          console.log("Logo Updated to", matchedToken.logoURI);
          portfolio.tokenName = matchedToken.name;
        }
      }
    }
    setLoading(false);
  }

  useEffect(() => {
    searchPortfolio();
  }, [result.isLoading]);

  const handleGetChart = () => {
    setTokenAddress(portfolio.contract_address);
  }

  return loading ? (
    <div></div>
  ) : (
    <div className="w-[90%] text-xs sm:text-md md:text-base md:w-1/3 card-gradient rounded-xl px-4 py-3 flex justify-between items-center drop-shadow-xl font-semibold hover:cursor-pointer" onClick={handleGetChart}>
      <div className="w-[70%] h-full flex items-center gap-4 py-2">
        <div className="w-1/4 bg-transparent rounded-full aspect-square relative">
          <Image
            src={portfolio.tokenLogo || result.data || ""}
            fill
            style={{ objectFit: "contain" }}
            alt="token"
            className="md:p-1"
          />
        </div>
        <div className="flex-col h-full w-full justify-center text-base md:text-lg flex gap-2">
          <p>{portfolio.tokenName || ""}</p>
          <div className="w-fit h-full flex gap-2 text-gray-400 items-center">
            {portfolio.price_to_usd > 0.001 ? (
              <p className="text-sm md:text-base">
                {portfolio.price_to_usd >= 1000
                  ? `$${Math.ceil(portfolio.price_to_usd)}`
                  : `$${Math.ceil(portfolio.price_to_usd * 1000) / 1000}`}
              </p>
            ) : (
              <p> {`<$0.001`} </p>
            )}
            <p
              className={`py-1 px-2 rounded-xl text-sm md:text-base ${
                portfolio.roi > 0
                  ? "text-green-400 bg-green-300 bg-opacity-20"
                  : portfolio.roi < 0
                  ? "text-red-500 bg-red-400 bg-opacity-20"
                  : "text-gray-500 bg-gray-500 bg-opacity-20"
              }`}
            >
              {portfolio.roi >= 0 ? "+" : ""}
              {Math.ceil(portfolio.roi * 10000) / 100}%
            </p>
          </div>
        </div>
      </div>
      <div className="flex-col h-full w-[30%] justify-center flex gap-2 text-base md:text-lg items-end p-1">
        <p>${Math.ceil(portfolio.value_usd * 100) / 100}</p>
        <p className="text-gray-400 text-sm md:text-base">
          {portfolio.amount >= 1000
            ? `${Math.ceil(portfolio.amount)}`
            : `${Math.ceil(portfolio.amount * 10000) / 10000}`}{" "}
          {portfolio.tokenSymbol}
        </p>
      </div>
    </div>
  );
};

export default PortfolioCard;
