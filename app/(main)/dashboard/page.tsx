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

async function swapLogic(walletAddress: string, price: string, signal: string) {
  const user = await getUserByUserID(walletAddress);
  const orderBook = user.orderBook;

  for (const order of orderBook) {
    if (
      order.tradeMin <= price &&
      order.tradeMax >= price &&
      order.transactionCount > 0
    ) {
      if (
        signal == order.orderType ||
        (signal == "HOLD" && order.orderType == "BUY")
      ) {
        // init swap here
        await reduceTransactionCount({
          userID: walletAddress,
          orderID: order.orderID,
        });
      }
    }
  }
}

const handleMessageSend = async (receiverAddress: string, message: string) => {
  console.log("Currently awaiting push notification")
  await sendMessage({
    receiverAdr: receiverAddress,
    message: message,
  });
  console.log("message and notification sent")
}

export default function Home() {
  // for notifications
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (isWaiting: boolean, hash: string) => {
    console.log("Creating Notification");
    api.open({
      message: isWaiting ? "Initializing Transaction" : "Transaction Confirmed",
      description: isWaiting
        ? `Please wait a few moments. Click to view your transaction: https://polygon.blockscout.com/tx/${hash}`
        : `Your transaction has been confirmed. Click to view your transaction: https://polygon.blockscout.com/tx/${hash}`,
      onClick: () => {
        window.location.href = `https://polygon.blockscout.com/tx/${hash}`;
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
  const [connected, setConnected] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<any>();

  // Transaction states
  const [txData, setTxData] = useState<any>(null);
  const [isApproved, setIsApproved] = useState(false);
  const [isSwapped, setIsSwapped] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const {
    data: swapHash,
    error: swapError,
    isPending: swapIsPending,
    sendTransaction,
  } = useSendTransaction();

  const { isLoading: isSwapConfirming, isSuccess: isSwapConfirmed } =
    useWaitForTransactionReceipt({ hash: swapHash });

  useEffect(() => {
    if (isPending == false) {
      setIsExecuting(false);
      setIsOpen(false);
      if(hash){
        openNotification(true, hash as any);
      }if(txData){
        handleMessageSend(account.address as string,`You have successfully transfered ${txData.transferAmount} ${txData.transferToken.symbol} to ${txData.receiverWalletAddress}(${txData.receiverName})`);
      } else {
        console.log("notif did not send")
      }
    }
  }, [isPending]);
  useEffect(() => {
    console.log("Tx Status Changed");
    if (swapIsPending == false) {
      if (isApproving) {setIsApproved(true);setIsApproving(false);setIsExecuting(false);openNotification(true, swapHash as any);}
      if (isSwapping) {
        setIsApproved(false);setIsSwapping(false);setIsExecuting(false);setIsOpen(false);openNotification(true, swapHash as any);
        if(txData){
          console.log("Initiating Push Notification")
          handleMessageSend(account.address as string, `You have successfully swapped ${txData.amount} ${txData.tokenToSell.symbol} to ${txData.tokenToBuy.symbol}.`);
          console.log(`You have successfully swapped ${txData.amount} ${txData.tokenToSell.symbol} to ${txData.tokenToBuy.symbol}`)
        }else{
          console.log("Push Notification Failed")
        }
      }
    }
  }, [swapIsPending]);

  useEffect(() => {
    if (primaryWallet) {
      setConnected(true);
      setConnectedWallet(primaryWallet);
    }
  }, [primaryWallet]);

  useEffect(() => {
    if (Object.keys(parsedResponse).length > 0) {
      openConfirmation(parsedResponse);
    }
  }, [parsedResponse]);

  async function initializeError(message: string) {
    // console.log("Opening Error Pop Up");
    setErrorMessage(message);
    setIsErrorOpen(true);
  }

  async function checkTransfer(args: any, user: any) {
    // Check Arguments
    const { specifiedToken, specifiedAmount, transferTo } =
      args.arguments as any;
    if (!specifiedToken || !specifiedAmount || !transferTo) {
      initializeError("Invalid Prompt");
      return;
    }
    // Search User Address in the database
    user.contacts.forEach((item: any) => {
      // console.log(item);
      // console.log(item.name);
    });
    const transferedUser = user.contacts.find(
      (item: any) => item.name.toLowerCase() === transferTo.toLowerCase()
    );
    if (!transferedUser) {
      initializeError("User Not Found");
      return;
    }
    const txData = {
      receiverName: transferTo,
      receiverWalletAddress: transferedUser.walletAddress,
      transferAmount: specifiedAmount,
    } as any;
    // Search Information of the Transfered Token
    if (specifiedToken === USDC.symbol) {
      txData.transferToken = USDC;
    } else if (specifiedToken === "ETH") {
      txData.transferToken = WETH;
    } else {
      initializeError("Token Not Found");
      return;
    }
    // Open Confirmation
    setTxData(txData);
    setIsOpen(true);
  }

  async function checkSwap(args: any) {
    // Check Arguments
    const { tokenToBuy, tokenToSell, specifiedAmount, specifiedToken } =
      args.arguments as any;
    if (!tokenToBuy || !tokenToSell || !specifiedAmount || !specifiedToken) {
      initializeError("Invalid Prompt");
      return;
    }
    const txData = {
      amount: specifiedAmount,
    } as any;

    // Search Information of Token1 and Token2
    // Specified Token with the amount
    if (specifiedToken === USDC.symbol) {
      txData.specifiedToken = USDC;
    } else if (specifiedToken === "ETH") {
      txData.specifiedToken = WETH;
    }
    // Token to Buy and Token to Sell
    if (tokenToBuy === USDC.symbol) {
      txData.tokenToBuy = USDC;
    } else if (tokenToBuy === "ETH") {
      txData.tokenToBuy = WETH;
    }
    if (tokenToSell === USDC.symbol) {
      txData.tokenToSell = USDC;
    } else if (tokenToSell === "ETH") {
      txData.tokenToSell = WETH;
    }
    // Final Check
    if (tokenToBuy === tokenToSell) {
      initializeError("Invalid Swap");
      return;
    }
    if (!tokenToBuy === specifiedToken && !tokenToSell === specifiedToken) {
      initializeError("Invalid Swap");
      return;
    }
    // Open Confirmation
    setTxData(txData);
    setIsOpen(true);
  }

  async function checkAISetting(args: any) {
    // Check Arguments
    let {
      tokenToBuy,
      tokenToSell,
      specifiedAmmount,
      specifiedToken,
      buyMax,
      buyMin,
      sellMax,
      sellMin,
    } = args.arguments as any;
    console.log(args.arguments);
    if (!buyMax && !buyMin && !sellMax && !sellMin) {
      initializeError("Configuration Price not set");
      return;
    } else if (!tokenToBuy && !tokenToSell) {
      initializeError("Token Not Specified");
      return;
    }

    const txData = {
      transactionCount: 3,
      lastTimeStampSinceTransaction: null,
    } as any;
    if(!specifiedAmmount){specifiedAmmount = 0.01}

    if (buyMin || buyMax) {
      txData.tradeMin = buyMin;
      txData.tradeMax = buyMax;
      if (tokenToBuy && tokenToBuy === "ETH") {
        txData.orderType = "BUY";
        txData.quantity = specifiedAmmount;
      } else if (tokenToSell == "ETH" || tokenToBuy == "USDC") {
        txData.orderType = "SELL";
        if (buyMin) {
          txData.quantity = specifiedAmmount / buyMin;
        } else {
          txData.quantity = specifiedAmmount / buyMax;
        }
      } else {
        initializeError("Invalid Token");
        return;
      }
    } else {
      txData.tradeMin = sellMin;
      txData.tradeMax = sellMax;
      if (tokenToSell && tokenToSell === "ETH") {
        txData.orderType = "SELL";
        txData.quantity = specifiedAmmount;
      } else if (tokenToSell == "USDC" || tokenToBuy == "ETH") {
        txData.orderType = "BUY";
        if (sellMin) {
          txData.quantity = specifiedAmmount / sellMin;
        } else {
          txData.quantity = specifiedAmmount / sellMax;
        }
      } else {
        initializeError("Invalid Token");
        return;
      }
    }
    setTxData(txData);
    setIsOpen(true);
  }

  async function openConfirmation(parsedResponse: any) {
    setIsExecuting(false);
    console.log("Processing Confirmation");
    const hasToolCall = "tool_calls" in parsedResponse;
    if (!hasToolCall) {
      initializeError("Invalid Prompt");
      return;
    }
    if (!account.address) {
      initializeError("You Are Not Logged In");
      return;
    }
    const user = await getContactByOwner(account.address as string);
    if (!user) {
      initializeError("Your User Account Was Not Found");
      return;
    }
    setUser(user);
    console.log("User Found");
    console.log(user);

    const args = processArguments(parsedResponse.tool_calls[0]);
    setProcessedArguments(args);

    try {
      // Check is Function Processing
      if (args.function === "transfer_tokens") {
        checkTransfer(args, user);
      } else if (args.function === "swap_tokens") {
        checkSwap(args);
      } else if (args.function === "settingAI") {
        checkAISetting(args);
      } else {
        initializeError("Invalid Prompt");
        return;
      }
    } catch (error) {
      // console.log(error);
      initializeError("Unknown Error Occured");
      return;
    }
  }

  async function executeTx(args: any) {
    // console.log("Executing Functions");
    setIsExecuting(true);
    try {
      if (processedArguments.function === "transfer_tokens") {
        // console.log("Executing Transfer");
        if (!txData) {
          alert("Unknown Error Occured");
          return;
        }
        // console.log(txData);
        // console.log("Transferring ERC-20 Token");
        const parsedAmount = BigInt(
          txData.transferAmount * Math.pow(10, txData.transferToken.decimals)
        );
        // console.log("Transfered Amount:", parsedAmount);

        writeContract({
          address: txData.transferToken.address,
          abi: ERC20ABI,
          functionName: "transfer",
          args: [txData.receiverWalletAddress, parsedAmount],
        });
      } else if (processedArguments.function === "swap_tokens") {
        // console.log("Executing Swap");
        if (!txData) {
          alert("Unknown Error Occured");
          return;
        }
        // console.log(txData);
        if (isApproved) {
          console.log("Performing the actual swap");
          const parsedAmount = BigInt(
            txData.amount * Math.pow(10, txData.tokenToSell.decimals)
          );
          const swapParams = {
            src: txData.tokenToSell.address,
            dst: txData.tokenToBuy.address,
            amount: parsedAmount.toString(),
            from: account.address,
            slippage: 1,
            chainId,
          } as any;
          const swapTx = await getSwapTransaction(swapParams);
          // console.log("Swap Tx Obtained");
          // console.log(swapTx);
          setIsSwapping(true);
          sendTransaction(swapTx.tx);
        } else {
          console.log("Requesting for Approval");
          const approvalTx = await getApproval(
            txData.tokenToSell.address,
            txData.amount,
            chainId,
            account.address as string,
            txData.tokenToSell.decimals
          );
          setIsApproving(true);
          sendTransaction(approvalTx);
        }
      } else if (processedArguments.function === "settingAI") {
        console.log("Adding AI Configuration");
        await addOrdertoOrderBook({
          userID: account.address as string,
          newOrder: txData,
        });
        setIsExecuting(false);
        setIsOpen(false);
      } else {
        alert("Unknown Error Occured");
      }
      setErrorMessage("");
    } catch (error) {
      console.log(error);
      alert("Error Happened");
    }
  }

  useEffect(() => {
    if (acceptAction) {
      // console.log("Accepted action");
      const args = processedArguments;
      executeTx(args);
      setAcceptAction(false);
    }
  }, [acceptAction]);

  const handleOpenModal = () => {
    setIsOpen(true);
  };

  return (
    <>
      {contextHolder}
      {connected ? (
        <div className="w-full h-screen flex-col flex items-center gap-4 -mt-8">
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

            <ActionErrorPopUp
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
            />
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