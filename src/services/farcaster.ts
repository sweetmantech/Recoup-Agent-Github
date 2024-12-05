import { getSSLHubRpcClient, HubInfoRequest } from "@farcaster/hub-nodejs";
import * as dotenv from "dotenv";

dotenv.config();

export class FarcasterService {
  private client;

  constructor() {
    if (!process.env.GRPC_ENDPOINT) {
      throw new Error("GRPC_ENDPOINT is required");
    }
    this.client = getSSLHubRpcClient(process.env.GRPC_ENDPOINT);
  }

  async verifyConnection(): Promise<boolean> {
    try {
      // Simple connection test - will throw if connection fails
      const request: HubInfoRequest = { dbStats: true };
      await this.client.getInfo(request);
      return true;
    } catch (error) {
      console.error("Error verifying Farcaster connection:", error);
      return false;
    }
  }
}
