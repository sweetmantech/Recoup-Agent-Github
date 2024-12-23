import { getSSLHubRpcClient } from "@farcaster/hub-nodejs";
import * as dotenv from "dotenv";

dotenv.config();

if (!process.env.GRPC_ENDPOINT) {
  throw new Error("GRPC_ENDPOINT is not set");
}
const farcasterClient = getSSLHubRpcClient(process.env.GRPC_ENDPOINT);

export default farcasterClient;
