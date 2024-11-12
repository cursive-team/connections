import { ReclaimProofRequest, verifyProof } from "@reclaimprotocol/js-sdk";
import { TwitterProofData, TwitterReclaimUrlResponse, TwitterReclaimCallbackResponse } from "../interface";

export class TwitterReclaimController {
  private readonly backendUrl: string;
  private readonly appId: string;
  private readonly appSecret: string;
  private readonly providerId: string;

  constructor() {
    this.backendUrl = process.env.BACKEND_URL!;
    this.appId = process.env.RECLAIM_APP_ID!;
    this.appSecret = process.env.RECLAIM_APP_SECRET!;
    this.providerId = process.env.RECLAIM_PROVIDER_ID!;
  }

  public async getTwitterReclaimUrl(userId: string, redirectUrl: string): Promise<TwitterReclaimUrlResponse> {
    try {
      const reclaimProofRequest = await ReclaimProofRequest.init(
        this.appId,
        this.appSecret,
        this.providerId
      );
      // @dev: add context Address and message to the claim response 
      await reclaimProofRequest.addContext(
        '0x0',
        userId // to add multiple context message use JSON.stringify({ key1: value1, key2: value2 })
      );

      // set the callback url (where the proof will be submitted)
      await reclaimProofRequest.setAppCallbackUrl(
        `${this.backendUrl}/api/reclaim/twitter/callback`
      );
   
      // set the redirect url (where the user will be redirected to after the proof is submitted)
      await reclaimProofRequest.setRedirectUrl(
        redirectUrl
      );

      const url = await reclaimProofRequest.getRequestUrl();
      // get the status of the user session 
      const status = await reclaimProofRequest.getStatusUrl();
      return { url, status };
    } catch (error) {
      console.error("Error getting Twitter Reclaim URL:", error);
      throw new Error("Failed to get Twitter Reclaim URL");
    }
  }

  public async handleCallback(proof: string): Promise<TwitterReclaimCallbackResponse> {
    try {
      const proofData: TwitterProofData = JSON.parse(decodeURIComponent(proof));
      // verify the proof 
      const isProofVerified = await verifyProof(proofData);
      
      if (!isProofVerified) {
        throw new Error("Proof verification failed");
      }
       
      // to retrieve the context data 
      const contextData = proofData.claimData.context;
      console.log(contextData);

      console.log(proofData);
      // to retrieve the public data (from the proof)
      console.log(proofData?.publicData);
      // your business logic here
      // ...
      return { message: 'proof submitted' };
    } catch (error) {
      console.error("Error handling Twitter Reclaim callback:", error);
      throw new Error("Failed to handle Twitter Reclaim callback");
    }
  }
}