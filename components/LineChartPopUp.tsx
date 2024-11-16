import {Component} from "@/components/LineChart";
import getChart from "@/utils/getChartData";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { Styles } from "react-modal";

const baseTokenData = [
    { time: 1731657600, value: 0 },
    { time: 1731661200, value: 0 },
    { time: 1731664800, value: 0 },
]

type LineChartPopUpProps = {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    tokenAddress: string;
}

const LineChartPopUp = ({isOpen, setIsOpen, tokenAddress} : LineChartPopUpProps) => {
    const [chartData, setChartData] = useState<any>(null);

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

    const handleCloseChart = () => {
        setChartData(null);
        setIsOpen(false);
    }
    
    const handleGetChart = async () => {
        const data = await getChart(tokenAddress);
        console.log(data);
        setChartData(data);
    }

    useEffect(() => {
        console.log("Is Open");
        console.log("GETTING CHART");
        if (isOpen && tokenAddress !== "") {
            console.log("GETTING CHART");
            handleGetChart();
        }
    }, [isOpen]);

    return (
        <>
            <div>
                <Modal
                    isOpen={isOpen}
                    ariaHideApp={false}
                    shouldCloseOnOverlayClick={true}
                    onRequestClose={handleCloseChart}
                    style={customStyles as Styles}
                >
                    <div>
                        {chartData && <Component chartData={chartData.data} />}
                        {!chartData && <Component chartData={baseTokenData} />}
                        {/* <div className="flex p-4 justify-between items-center w-full bg-card">
                            <div>
                                <h1>Token Address: {chartData ?  tokenAddress : "mockdata"}</h1>
                            </div>
                            <button onClick={handleCloseChart}>Close</button>
                        </div> */}
                    </div>
                </Modal>
            </div>
        </>
    )
}

export default LineChartPopUp;