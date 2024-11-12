export interface TwitterProofData {
  claimData: {
    context: any;
    identifier: string;
    provider: string;
    parameters: Record<string, unknown>;
  };
  contextMessage?: string;
  contextAddress?: string;
  publicData?: object;
}

export interface TwitterReclaimUrlResponse {
  url: string;
  status: string;
}

export interface TwitterReclaimCallbackResponse {
  message: string;
}
