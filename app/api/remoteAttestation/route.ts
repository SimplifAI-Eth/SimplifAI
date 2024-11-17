import { TappdClient } from "@phala/dstack-sdk";
<<<<<<< HEAD
=======
// import "dotenv/config";
>>>>>>> origin/main

export const dynamic = "force-dynamic";

const endpoint = "http://localhost:8090";

export async function GET() {
  console.log(endpoint);
  const client = new TappdClient(endpoint);
  const randomNumString = Math.random().toString();
  console.log(randomNumString);
  const getRemoteAttestation = await client.tdxQuote(randomNumString);
  console.log("after getRemoteAttestation", getRemoteAttestation);
  return Response.json(getRemoteAttestation);
}
