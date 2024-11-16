import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, { params }: { params: any }) {
  const { userID, orderID } = await req.json();

  const response = await fetch(
    `http://localhost:4000/api/wallet/user/${userID}/order/${orderID}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  console.log("response after deleting:", response);

  const data = await response.json();
  console.log("data after deleting:", data);

  return NextResponse.json(data, { status: response.status });
}
