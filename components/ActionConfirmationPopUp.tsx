import React, { useEffect } from "react";
import Modal from "react-modal";
import { Styles } from "react-modal";
import { useState } from "react";
import processArguments from "@/utils/processArguments";
import { FiAlertTriangle } from "react-icons/fi";
import { SlQuestion } from "react-icons/sl";
import TransferCard from '@/components/confirmation-components/Transfer';
import Button from '@/components/landing-components/Button';
import RedButton from '@/components/landing-components/RedButton';
import SwapCard from "@/components/confirmation-components/Swap";
import AI from "@/components/confirmation-components/AI";

const swapDummyData = {
  tokenSwapFrom: {logoURI: "https://tokens.1inch.io/0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee.png", symbol: "WETH"},
  tokenSwapTo: {logoURI: "https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=035", symbol: "USDC"},
  tokenSwapFromAmount: 10
};

const aiDummyData = {
  tradeMin: 100,
  tradeMax: 200,
  orderType: "BUY",
  quantity: 0.001,
  transactionCount: 3,
  lastTimeStampSinceTransaction: new Date()
};


type ActionConfirmationPopUpProps = {
  response: any;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setAcceptAction: React.Dispatch<React.SetStateAction<boolean>>;
  setProcessedArguments: React.Dispatch<React.SetStateAction<any>>;
  txData: any;
  isExecuting: boolean;
}

const ActionConfirmationPopUp = ({response, isOpen, setIsOpen, setAcceptAction, setProcessedArguments, txData, isExecuting}: ActionConfirmationPopUpProps) => {
  const hasToolCall = 'tool_calls' in response;
  const [isTransfer, setIsTransfer] = useState<boolean>(false);
  const [isSwap, setIsSwap] = useState<boolean>(false);
  const [isSwapping, setIsSwapping] = useState<boolean>(false);
  const [isSettingAI, setIsSettingAI] = useState<boolean>(false);
  const [type, setType] = useState<string>("");

  const [txCard, setTxCard] = useState<any>(null);
  useEffect(() => {
    try {
      if (!hasToolCall) {
        return;
      }
      const args = processArguments(response.tool_calls[0]);
      if (args.function === "transfer_tokens") {
        console.log("TxData:");
        console.log(txData);
        if (
          txData.receiverName &&
          txData.receiverWalletAddress &&
          txData.transferToken &&
          txData.transferAmount
        ) {
          console.log("Is Transfer");
          setIsTransfer(true);
          return;
        }else{
          console.log("Not Transfer")
        }
      }
      else if(args.function === "swap_tokens"){
        console.log("Tx Data");
        console.log(txData);
        if(txData.tokenToBuy, txData.tokenToSell, txData.amount){
          setIsSwap(true);
        }
      }
      else if(args.function === "settingAI"){
        console.log("Setting AI");
        console.log(txData);
        if(txData){
          setIsSettingAI(true);
        }
      }
      else{
        alert("Unknown Function")
      }
    } catch (error) {
      console.log(error);
    }
  }, [isOpen]);

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      height: "auto",
      width: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#112233",
      border: "none",
      borderRadius: "10px", // Add this line for rounded border
      padding: "0px",
      // boxShadow: '0 0 10px 2px rgba(46, 211, 183, 0.5)',
    },
  };

  const handleClosePopUp = () => {
    setIsOpen(false);
  };

  const handleAcceptAction = () => {
    console.log("Handle Accept")
    setAcceptAction(true);
    let args = processArguments(response.tool_calls[0]);
    setProcessedArguments(args);
    if(isSwap){
      setIsSwapping(!isSwapping);
    }
  }
  //receiverName, receiverWalletAddress, transferToken, transferAmount

  return (
    <div className="gap-4 flex-col ">
      <Modal
        isOpen={isOpen}
        ariaHideApp={false}
        shouldCloseOnOverlayClick={false}
        onRequestClose={() => setIsOpen(false)}
        style={customStyles as Styles}
      >
        {hasToolCall ? (
          <div className="flex flex-col h-full w-full transform transition hover:shadow-lg backdrop-blur-sm card-gradient pt-4">
            <div className="flex flex-col justify-center text-center items-center w-full py-3 mt-4">
              <h1 className="text-3xl font-semibold bg-v2-text-gradient bg-clip-text text-transparent ml-6 mr-6">
                Confirm Transaction
              </h1>
            </div>
            {/*<div className="flex w-full justify-around">
              <button
                onClick={() => {
                  setType("transfer");
                  setIsTransfer(true);
                  setIsSwap(false);
                  setIsSettingAI(false);
                }}
              >
                Transfer
              </button>
              <button
                onClick={() => {
                  setType("swap");
                  setIsTransfer(false);
                  setIsSwap(true);
                  setIsSettingAI(false);
                }}
              >
                Swap
              </button>
              <button
                onClick={() => {
                  setType("ai");
                  setIsTransfer(false);
                  setIsSwap(false);
                  setIsSettingAI(true);
                }}
              >
                AI
              </button>
            </div>*/}
            <div className="w-full ">
              {isTransfer ? (
                <TransferCard
                  receiverName={txData.receiverName}
                  receiverWalletAddress={txData.receiverWalletAddress}
                  transferToken={txData.transferToken}
                  transferAmount={txData.transferAmount}
                />
              ) : isSwap ? (
                <SwapCard
                  tokenSwapFrom={txData.tokenToSell}
                  tokenSwapTo={txData.tokenToBuy}
                  tokenSwapFromAmount={txData.amount}
                />
              ) : isSettingAI ? (
                <AI 
                  tradeMin={txData.tradeMin} 
                  tradeMax={txData.tradeMax}
                  orderType={txData.orderType}
                  quantity={txData.quantity}
                  transactionCount={txData.transactionCount}
                  lastTimeStampSinceTransaction={txData.lastTimeStampSinceTransaction}
                />
              ) : (
                "Unknown Transaction"
              )}
            </div>
            <div className="flex w-full justify-between items-center mb-10 pl-6 pr-6">
              <RedButton onClick={handleClosePopUp}>
                <h1 className="text-xl">Reject</h1>
              </RedButton>
              <div className="border border-[#2ed3b7] rounded-xl">
                <Button onClick={isExecuting ? () => {} : handleAcceptAction}>
                  <h1 className="text-xl">{isExecuting? "Loading": isSwapping? "Swap": "Approve"}</h1>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full w-full transform transition hover:shadow-lg bg-gray-800 p-5">
            <div className="flex flex-col justify-center items-center w-full p-3 pt-8 text-wrap">
              <FiAlertTriangle size={120} color={"#f87171"} />
              <h1 className="text-3xl text-red-400 font-extrabold pt-4">
                Error
              </h1>
              <h1 className="text-xl font-semibold">Prompt Not Recognized</h1>
            </div>
            <div className="flex w-full h-full p-3">
              <h1 className="text-center text-xl">
                {/** response.content*/}Please Try Again
              </h1>
            </div>
            <div className="flex w-full justify-around items-center p-3">
              <div
                className="flex justify-center items-center w-28 h-10 bg-red-500 rounded-full p-2"
                onClick={handleClosePopUp}
              >
                <h1 className="text-2xl">Close</h1>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ActionConfirmationPopUp;
