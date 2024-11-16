import {Component} from "@/components/LineChart";
import getChart from "@/utils/getChartData";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import { Styles } from "react-modal";

const mockTokenData = [
    { time: 1731657600, value: 3064.87819940756 },
    { time: 1731661200, value: 3098.209765686975 },
    { time: 1731664800, value: 3101.034674611459 },
    { time: 1731668400, value: 3098.9223628849 },
    { time: 1731672000, value: 3098.4006589559017 },
    { time: 1731675600, value: 3107.9047462492726 },
    { time: 1731679200, value: 3066.539621586942 },
    { time: 1731682800, value: 3021.6366859291 },
    { time: 1731686400, value: 3031.9917261297037 },
    { time: 1731690000, value: 3045.5529908425633 },
    { time: 1731693600, value: 3027.0947139755394 },
    { time: 1731697200, value: 3042.7279813808714 },
    { time: 1731700800, value: 3083.570071484961 },
    { time: 1731704400, value: 3089.216717868855 },
    { time: 1731708000, value: 3104.7951464197595 },
    { time: 1731711600, value: 3095.643199857981 },
    { time: 1731715200, value: 3080.969234276621 },
    { time: 1731718800, value: 3101.1760934188183 },
    { time: 1731722400, value: 3114.8228010306775 },
    { time: 1731726000, value: 3145.9553109618023 },
    { time: 1731729600, value: 3135.8846084431266 },
    { time: 1731733200, value: 3133.4981726554383 },
    { time: 1731736800, value: 3118.4911484177096 },
    { time: 1731740400, value: 3119.640831632943 }
  ];

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