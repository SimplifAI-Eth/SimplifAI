import { NextRequest, NextResponse } from 'next/server';

const USDCADDRESS = "0x3c499c542cef5e3811e1192ce70d8cc03d5c3359";

const chainId = 137;
const token1 = USDCADDRESS;

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

    const endpoint = `https://api.1inch.dev/charts/v1.0/chart/line/${tokenAddress}/${token1}/24H/${chainId}`;
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