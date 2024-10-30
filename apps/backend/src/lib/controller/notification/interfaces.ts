export interface iNotificationClient {
  Initialize(): Promise<void>;
  SendNotification(userId: string, message: string): Promise<boolean>;
}
