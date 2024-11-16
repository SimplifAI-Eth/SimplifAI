import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: any }) {
  const { userID, amount, tokenSymbol } = await req.json();

  const response = await fetch(
    `http://localhost:4000/api/wallet/user/${userID}/cashout`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, tokenSymbol }),
    }
  );

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
