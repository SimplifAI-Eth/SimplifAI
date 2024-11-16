import { NextRequest, NextResponse } from 'next/server';

const ETHADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee";
const USDCADDRESS = "0xdac17f958d2ee523a2206206994597c13d831ec7";

const chainId = 137;
const token1 = ETHADDRESS;

export async function GET(req: NextRequest ) {
    const { searchParams } = new URL(req.url);
    const tokenAddress = searchParams.get('tokenAddress');

    if (!tokenAddress) {
        return NextResponse.json({ error: 'Token Address Not Specified' }, { status: 400 });
    }

    const ONEINCH_API_KEY = process.env.NEXT_PUBLIC_ONEINCH_API_KEY;

    if (!ONEINCH_API_KEY) {
        return NextResponse.json({ error: 'ONEINCH_API_KEY environment variable is not defined' }, { status: 500 });
    }

    const endpoint = `https://api.1inch.dev/charts/v1.0/chart/line/${token1}/${tokenAddress}/24H/${chainId}`;
    try {
        const chart = await fetch(endpoint, {
            headers: { Authorization: `Bearer ${ONEINCH_API_KEY}` }
        }).then((res) => res.json());
        console.log(chart);
        return NextResponse.json(chart);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Unable to fetch chart data' }, { status: 500 });
    }
}