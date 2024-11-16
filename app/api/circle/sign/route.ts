import { NextRequest, NextResponse } from "next/server";

const {initiateDeveloperControlledWalletsClient} = require('@circle-fin/developer-controlled-wallets');
const crypto = require('crypto');

export async function POST(req: NextRequest, { params }: { params: any }) {
  const data = await req.json();
  console.log(data);

  const client = initiateDeveloperControlledWalletsClient({
    apiKey: process.env.NEXT_PUBLIC_CIRCLE_API_KEY,
    entitySecret: process.env.NEXT_PUBLIC_ENTITY_SECRET
  });
  console.log("Client Initialized")

  if(!data.walletId){
    return NextResponse.json({ error: 'Token Not Specified'}, {status: 500});
  }
  if(!data.tx){
      return NextResponse.json({ error: 'Approval Amount Not Specified'}, {status: 500});
  }

  try{
    console.log("Signing Transaction")
    const responseObject = await client.signTransaction({
      walletID: data.walletId,
      transaction: JSON.stringify(data.tx), // Pass the transaction object
    });
    console.log(responseObject);
    return NextResponse.json(responseObject.data);

  }catch(e){
    console.log(e);
    return NextResponse.json({ error: 'Unable to fetch data' }, {status: 500});
  }
}


// export async function POST(req: NextRequest){
//   if(!process.env.NEXT_PUBLIC_ONEINCH_API_KEY){
//       return NextResponse.json({ error: 'API Key Not Detected'}, {status: 500});
//   }
//   try{
//       const data = await req.json();
//       console.log(data);
//       if(!data.tokenAddress){
//           return NextResponse.json({ error: 'Token Not Specified'}, {status: 500});
//       }
//       if(!data.amount){
//           return NextResponse.json({ error: 'Approval Amount Not Specified'}, {status: 500});
//       }
//       if(!data.chainId){
//           return NextResponse.json({ error: 'Chain Id Not Specified'}, {status: 500});
//       }
//       const endpoint = `https://api.1inch.dev/swap/v6.0/${data.chainId}/approve/transaction?tokenAddress=${data.tokenAddress}&amount=${data.amount}`;    
//       const tx = await fetch(endpoint, {
//           headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_ONEINCH_API_KEY}` }
//       }).then((res) => res.json());
//       return NextResponse.json({tx})
//   }catch(error){
//       console.log(error);
//       return NextResponse.json({ error: 'Unable to fetch data' }, {status: 500});
//   }
// }
