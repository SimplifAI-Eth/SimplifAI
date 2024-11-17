"use client";

import DesktopRecordButton from "@/components/DesktopRecordButton";
import MobileRecordButton from "@/components/MobileRecordButton";
import { useDynamicContext, useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { useState, useEffect } from "react";
import ActionConfirmationPopUp from "@/components/ActionConfirmationPopUp";
import ActionErrorPopUp from "@/components/ActionErrorPopUp";
import { getContactByOwner } from "@/lib/db_actions/contact-actions";
import { useAccount, useChainId, useReadContract } from "wagmi";
import { config } from "@/utils/config";
import processArguments from "@/utils/processArguments";
import { set } from "mongoose";
import { USDC, WETH } from "@/utils/defaultToken";
import { ETH_CHAIN_ID } from "@pushprotocol/restapi/src/lib/config";
import { tokenList } from "@/utils/tokenList";
import { setNextBlockBaseFeePerGas } from "viem/actions";
import {
  useSendTransaction,
  useWriteContract,
  useWaitForTransactionReceipt,
  type BaseError,
} from "wagmi";
import { ERC20ABI } from "@/utils/abi";
import { getApproval, getSwapTransaction } from "@/utils/oneinch";
import {
  addOrdertoOrderBook,
  getUserByUserID,
  reduceTransactionCount,
} from "@/lib/db_actions/user-actions";
import sendMessage from "@/utils/sendMes";

import { notification } from "antd";

export default function Home() {
  // for notifications
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (isWaiting: boolean, hash: string) => {
    api.open({
      message: isWaiting ? "Initializing Transaction" : "Transaction Confirmed",
      description: isWaiting
        ? `Please wait a few moments. Click to view your transaction: https://polygonscan.com/tx/${hash}`
        : `Your transaction has been confirmed. Click to view your transaction: https://polygonscan.com/tx/${hash}`,
      onClick: () => {
        window.location.href = `https://polygonscan.com/tx/${hash}`;
      },
      duration: 10,
    });
  };

  const { primaryWallet } = useDynamicContext();
  const isLoggedIn = useIsLoggedIn();
  const [parsedResponse, setParsedResponse] = useState<any>({});

  // Modal states
  const [isOpen, setIsOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [acceptAction, setAcceptAction] = useState(false);
  const [processedArguments, setProcessedArguments] = useState<any>({});
  const [isExecuting, setIsExecuting] = useState(false);

  // User states
  const [user, setUser] = useState<any>();
  const account = useAccount({ config });
  const chainId = useChainId();

  // Transaction states
  const [txData, setTxData] = useState<any>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [isSwapped, setIsSwapped] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  //const { data: hash, isPending,sendTransaction } = useSendTransaction() ;
  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

    async function swapLogic(walletAddress: string, price: string, signal: string) {
      const user = await getUserByUserID(walletAddress);
      const orderBook = user.orderBook;
  
      for (const order of orderBook) {
        if (order.tradeMin <= price && order.tradeMax >= price && order.transactionCount > 0) {
          if(signal == order.orderType || (signal == "HOLD" && order.orderType == "BUY")) {
          // init swap here
          await reduceTransactionCount({
            userID: walletAddress,
            orderID: order.orderID,
          });
          }
        }
      }

  const {
    data: swapHash,
    error: swapError,
    isPending: swapIsPending,
    sendTransaction,
  } = useSendTransaction();
  const { isLoading: isSwapConfirming, isSuccess: isSwapConfirmed } =
    useWaitForTransactionReceipt({ hash: swapHash });

  // Update Status once transaction confirmed
  // useEffect(() => {
  //   if (isPending == false) {
  //     sendMessage({
  //       receiverAdr: account.address as string,
  //       message: `You have successfully swapped ${txData.transferAmount} ${txData.transferToken.symbol} to ${txData.receiverName}.`,
  //     });
  //     setIsExecuting(false);
  //     setIsOpen(false);
  //   }
  // }, [isPending]);
  // useEffect(() => {
  //   console.log("Tx Status Changed");
  //   if (swapIsPending == false) {
  //     if (isApproving) {
  //       setIsApproved(true);
  //       setIsApproving(false);
  //       setIsExecuting(false);
  //     }
  //     if (isSwapping) {
  //       setIsApproved(false);
  //       setIsSwapping(false);
  //       setIsExecuting(false);
  //       sendMessage({
  //         receiverAdr: account.address as string,
  //         message: `You have successfully swapped ${txData.amount} ${txData.tokenToSell.symbol} to ${txData.tokenToBuy.symbol} token.`,
  //       });
  //       setIsOpen(false);
  //     }
  //   }
  // }, [swapIsPending]);
  // useEffect(() => {
  //   if (isPending == false) {
  //     setIsExecuting(false);
  //     setIsOpen(false);
  //   }
  // }, [isPending]);

    // useEffect(() => {
    //   if (Object.keys(parsedResponse).length > 0) {
    //     openConfirmation(parsedResponse);
    //   }
    // }, [parsedResponse]);

    async function initializeError(message: string) {
      // console.log("Opening Error Pop Up");
      setErrorMessage(message);
      setIsErrorOpen(true);
    }

    // async function openConfirmation(parsedResponse: any) {
    //   console.log("Processing Confirmation");
    //   const hasToolCall = "tool_calls" in parsedResponse;
    //   if (!hasToolCall) {
    //     initializeError("Invalid Prompt");
    //     return;
    //   }
    //   if (!account.address) {
    //     initializeError("You Are Not Logged In");
    //     return;
    //   }
    //   const user = await getContactByOwner(account.address as string);
    //   if (!user) {
    //     initializeError("Your User Account Was Not Found");
    //     return;
    //   }
    //   setUser(user);
    //   console.log("User Found");
    //   console.log(user);

    //   const args = processArguments(parsedResponse.tool_calls[0]);
    //   setProcessedArguments(args);

    //   try {
    //     // Check is Function Processing
    //     if (args.function === "transfer_tokens") {
    //       checkTransfer(args, user);
    //     } else if (args.function === "swap_tokens") {
    //       checkSwap(args);
    //     } else if (args.function === "settingAI") {
    //       checkAISetting(args);
    //     } else {
    //       initializeError("Invalid Prompt");
    //       return;
    //     }
    //   } catch (error) {
    //     // console.log(error);
    //     initializeError("Unknown Error Occured");
    //     return;
    //   }
    // }
    
    return (
      <>
        {isLoggedIn ? (
          <div className="w-full h-screen flex-col flex items-center gap-4 -mt-8">
            {hash && <div>Transaction Hash: {hash}</div>}
            {isConfirming && <div>Waiting for confirmation...</div>}
            {isConfirmed && <div>Transaction confirmed.</div>}
            {error && (
              <div>
                Error: {(error as BaseError).shortMessage || error.message}
              </div>
            )}

            {swapHash && <div>Transaction Hash: {swapHash}</div>}
            {isSwapConfirming && <div>Waiting for confirmation...</div>}
            {isSwapConfirmed && <div>Transaction confirmed.</div>}
            {swapError && (
              <div>
                Error: {(error as BaseError).shortMessage || error?.message}
              </div>
            )}
            <div className="md:w-1/4">
              <div className="md:hidden w-screen h-50">
                <MobileRecordButton setParsedResponse={setParsedResponse} />
              </div>
              <div className="hidden w-full h-full md:flex justify-center items-center">
                <DesktopRecordButton setParsedResponse={setParsedResponse} />
              </div>
              {/*<div>
              {Object.keys(processedArguments).length > 0 && (
                <p>{JSON.stringify(processedArguments, null, 2)}</p>
              )}
            </div>*/}

              {/*<ActionErrorPopUp
                message={errorMessage}
                isOpen={isErrorOpen}
                setIsOpen={setIsErrorOpen}
              />
              <ActionConfirmationPopUp
                response={parsedResponse}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                setAcceptAction={setAcceptAction}
                setProcessedArguments={setProcessedArguments}
                txData={txData}
                isExecuting={isExecuting}
              />*/}
            </div>
          </div>
        ) : (
          <div className="flex text-xl mt-24 font-semibold justify-center text-center w-full items-center">
            <p className="w-2/3">
              Please connect your wallet to use our features.
            </p>
          </div>
        )}
      </>
    );
  }
}
