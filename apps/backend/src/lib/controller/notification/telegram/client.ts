import { Bot } from "grammy";
import { iNotificationClient } from "../interfaces";
import { PrismaClient } from "@prisma/client";

export class TelegramNotificationClient implements iNotificationClient {
  private bot: Bot | undefined;
  private readonly maxRetries = 3;
  private readonly retryDelay = 5000;
  prismaClient: PrismaClient;

  constructor() {
    this.prismaClient = new PrismaClient();

    if (!process.env.TELEGRAM_BOT_API) {
      // No token, so we don't initialize
      return;
    }
    this.bot = new Bot(process.env.TELEGRAM_BOT_API);
  }

  private async setupBot(): Promise<void> {
    if (!this.bot) {
      throw new Error("Bot is not initialized");
    }

    this.bot.command("start", async (ctx) => {
      // The start parameter will be available in ctx.match
      const startParameter = ctx.match;

      if (startParameter) {
        // This is where you can link the Telegram user with your backend user
        const telegramUserId = ctx.from?.id;
        const backendUserId = startParameter;

        if (!telegramUserId || !backendUserId) {
          throw new Error("Invalid user IDs");
        }

        try {
          // Store the association in your database
          await this.prismaClient.user.update({
            where: { id: backendUserId },
            data: { notificationUserId: telegramUserId?.toString() },
          });

          await ctx.reply(
            `I'm Curtis, the Cursive Connections bot. I'm here to help you discover and deepen your connections.`
          );
        } catch (error) {
          await ctx.reply(
            "Sorry, there was an error linking your account. Please try connecting again."
          );
          console.error("Linking error:", error);
        }
      } else {
        await ctx.reply(
          "Welcome! Please register for notifications from your profile page."
        );
      }
    });

    this.bot.start({
      onStart: (info) => {
        console.log(`[TELEGRAM] Started bot '${info.username}' successfully!`);
      },
    });
  }

  async Initialize(): Promise<void> {
    const startDelay = parseInt(process.env.TELEGRAM_BOT_START_DELAY_MS ?? "0");
    await new Promise((resolve) => setTimeout(resolve, startDelay));

    for (let i = 0; i < this.maxRetries; i++) {
      try {
        await this.setupBot();
        console.log("Telegram notification client initialized");
        return;
      } catch (error) {
        console.log(
          `Telegram initialization failed, retrying in ${this.retryDelay}ms...`
        );
        await new Promise((resolve) => setTimeout(resolve, this.retryDelay));
      }
    }
    throw Error("Unable to initialize Telegram client")
  }

  async SendNotification(userId: string, message: string): Promise<boolean> {
    if (!this.bot) {
      console.error("Telegram client not initialized");
      return false;
    }

    try {
      const user = await this.prismaClient.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        console.error("User not found");
        return false;
      }

      if (!user?.notificationUserId) {
        console.error("User not linked to Telegram");
        return false;
      }

      await this.bot.api.sendMessage(user.notificationUserId, message);
      return true;
    } catch (error) {
      console.error("Failed to send Telegram notification:", error);
      return false;
    }
  }
}
