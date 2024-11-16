import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: any }) {
  const { userPrivateAddress, userPreference } = await req.json();

  const response = await fetch("http://localhost:4000/api/wallet/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userPrivateAddress,
      userPreference,
    }),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}
