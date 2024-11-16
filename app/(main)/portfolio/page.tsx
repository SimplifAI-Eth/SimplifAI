"use client";
import { useState, useEffect } from "react";
import { getTokenDetails, getTokenInformations } from "@/utils/oneinch";
import { TokenInformation } from "@/types/index";
import { CgSpinner } from "react-icons/cg";
import { useAccount, useChainId, useReadContract } from "wagmi";
import { config } from "@/utils/config";
import PortfolioCard from "@/components/PortfolioCard";
import LineChartPopUp from "@/components/LineChartPopUp";

const CHAIN_ID = 137;
const WALLET_ADDRESS = "0x67BDB62C0FF92187490DD34ed1BCEEdD3e47d517";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const mockEthData: TokenInformation = {
  contract_address: "0x",
  chain_id: 0,
  amount: 0,
  price_to_usd: 3132,
  value_usd: 0,
  abs_profit_usd: 0,
  roi: 0,
  status: 0,
  tokenName: "Ethereum",
  tokenSymbol: "ETH",
  tokenLogo:
    "https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png",
};

export default function Home() {
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [finished, setFinished] = useState<boolean>(false);
  const [userBal, setUserBal] = useState<number>(0);
  const [userProfit, setuserProfit] = useState<number>(0);
  const [userROI, setUserROI] = useState<number>(0);
  const [portfolioFetched, setPortfolioFetched] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [tokenAddress, setTokenAddress] = useState<string>("");
  const account = useAccount({ config });
  const chainId = useChainId();

  const fetchPortfolio = async () => {
    if (!account.address) {
      return;
    }
    // Search for all tokens held by the user
    const tokenDetails = await getTokenDetails(WALLET_ADDRESS, CHAIN_ID); // mock data using mario's wallet and ethereum main net
    // const tokenDetails = await getTokenDetails(account.address, chainId);
    console.log(tokenDetails);
    if (!tokenDetails) {
      return;
    }
    const tokenResult = tokenDetails.result;

    // Find the addresses of token in the portfolio
    const tokenAddresses = tokenResult.map(
      (item: TokenInformation) => item.contract_address
    );
    console.log(tokenAddresses);

    // Find the information of each token in the portfolio
    await delay(2000);
    const tokenInformations = await getTokenInformations(
      tokenAddresses,
      chainId
    );
    console.log(tokenInformations);

    tokenResult.forEach((item: TokenInformation, index: number) => {
      if (!tokenInformations) {
        return;
      }
      const contractAddress = item.contract_address;
      const tokenInfo = tokenInformations[contractAddress];
      // Token would not be added if data is not found
      if (tokenInfo) {
        tokenResult[index] = {
          ...tokenResult[index],
          tokenName: tokenInfo.name,
          tokenSymbol: tokenInfo.symbol,
          tokenLogo: tokenInfo.logoURI,
        };
      }
    });
    console.log("Process Completed");
    console.log(tokenResult);
    setPortfolio(tokenResult);
  };

  const calcBalance = () => {
    console.log(portfolio);

    let totalBal = 0;
    let totalProfit = 0;

    portfolio.forEach((token) => {
      totalBal += token.value_usd;
      totalProfit += token.abs_profit_usd;
    });

    setUserBal(Math.ceil(totalBal * 100) / 100);
    setuserProfit(Math.ceil(totalProfit * 100) / 100);
    setUserROI(
      Math.ceil((totalProfit / (totalBal - totalProfit)) * 10000) / 100
    );
  };

  useEffect(() => {
    if (account.address) {
      fetchPortfolio();
      setPortfolioFetched(true);
      console.log("fetched portfolio of", account.address);
    }
  }, [account.address]);

  useEffect(() => {
    if (account.address && portfolioFetched) {
      calcBalance();
      setLoading(false);
      setFinished(true);
    }
  }, [portfolio, loading]);

  useEffect(() => {
    console.log("Token Address", tokenAddress);
    if (tokenAddress === "") {
      return;
    }
    setIsOpen(true);
  }, [tokenAddress]);

  useEffect(() => {
    if (!isOpen) {
      setTokenAddress("");
    }
  }, [isOpen]);

  return (
    <>
      <div className="w-full h-screen flex-col flex items-center gap-4 max-md:-mt-16 pb-16">
        {/* Spinner for when loading */}
        {(!finished || (loading && portfolio.length == 0)) && (
          <div className="w-full h-fit flex flex-col gap-4 items-center justify-center">
            <CgSpinner className="animate-spin h-10 w-10" />
            <p>Loading...</p>
          </div>
        )}
        {/* Balance and other information */}
        {finished && !loading && portfolioFetched && (
          <div className="flex flex-col w-full h-fit items-center justify-center gap-4 md:mt-8">
            <p className="w-fit font-semibold text-4xl">${userBal}</p>
            <div className="flex h-fit w-fit items-center justify-center gap-4">
              <p
                className={`${
                  userProfit > 0
                    ? "text-green-400"
                    : userProfit < 0
                    ? "text-red-500"
                    : ""
                } text-lg font-semibold`}
              >
                {userProfit > 0 ? "+ " : userProfit < 0 ? "- " : ""}$
                {Math.abs(userProfit)}
              </p>
              <p
                className={`${
                  userProfit > 0
                    ? "text-green-400 bg-green-300"
                    : userProfit < 0
                    ? "text-red-500 bg-red-400"
                    : "text-gray-400"
                } text-lg font-semibold bg-opacity-20 rounded-xl px-3 py-1`}
              >
                {userROI || "+ 0"}%
              </p>
            </div>
          </div>
        )}

        {/* Mock ethereum portfolio */}
        {portfolio.length == 0 && !loading && finished && (
          <PortfolioCard portfolio={mockEthData} setTokenAddress={setTokenAddress} />
        )}

        {/* Actual portfolio */}
        {!loading &&
          finished &&
          portfolio.map((portofolio, index) => (
            <PortfolioCard key={index} portfolio={portofolio} setTokenAddress={setTokenAddress} />
          ))}
        <LineChartPopUp isOpen={isOpen} setIsOpen={setIsOpen} tokenAddress={tokenAddress} />
      </div>
    </>
  );
}
