const ETHADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
const USDCADDRESS = "0xdac17f958d2ee523a2206206994597c13d831ec7";

const chainId = 137;
const token1 = ETHADDRESS;
// const token2 = USDCADDRESS;

async function getChart(tokenAddress: string) {
    const endpoint = `/api/1inch/chart?tokenAddress=${tokenAddress}`;
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`Error fetching chart data: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export default getChart;