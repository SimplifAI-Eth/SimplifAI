import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: any }) {
  const { userID } = await req.json();

  const response = await fetch(
    `http://localhost:4000/api/wallet/user/${userID}/balance`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  console.log("response after getting balance:", response);

  const data = await response.json();
  console.log("data after getting balance:", data);
  return NextResponse.json(data, { status: response.status });
}
