import { Bot } from "grammy";
import { iNotificationClient } from "../interfaces";
import { PrismaClient } from "@prisma/client";
import { CommandContext, Context } from "grammy";

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

  private async register(ctx: CommandContext<Context>): Promise<void> {
    const telegramUserId = ctx.from?.id;
    const telegramUsername = ctx.from?.username;
    const backendUserId = ctx.match;

    try {
      if (!telegramUserId || !backendUserId) {
        throw new Error("Invalid user IDs");
      }

      // Store the association in your database
      await this.prismaClient.user.update({
        where: { id: backendUserId },
        data: {
          notificationUserId: telegramUserId?.toString(),
          notificationUsername: telegramUsername,
          notificationsEnabled: true,
        },
      });

      await ctx.reply(
        `I'm Curtis, the Cursive Connections bot. I'm here to help you discover and deepen your connections.`
      );
      await ctx.reply(
        `If you want to stop Cursive Telegram notifications, enter /stop.`
      );
      await ctx.reply(`If you want to resume at any time enter /start.`);
      await ctx.reply(
        `If you want to offer feedback and chat with the team enter /feedback.`
      );
      return;
    } catch (error) {
      await ctx.reply(
        "Sorry, there was an error linking your account. Please try connecting again from your profile in the app."
      );
      console.error("Linking error:", error);
      return;
    }
  }

  private async stop(ctx: CommandContext<Context>): Promise<void> {
    // The start parameter will be available in ctx.from
    const telegramUsername = ctx.from?.username;

    if (telegramUsername) {
      try {
        // Lookup user by telegram name from database
        const user = await this.prismaClient.user.findFirst({
          where: { notificationUsername: telegramUsername },
        });

        if (!user) {
          throw new Error("User not registered.");
        }

        await this.prismaClient.user.update({
          where: { id: user.id },
          data: {
            notificationsEnabled: false,
          },
        });

        await ctx.reply(
          `Done! If you want to enable notifications at any time enter /start.`
        );

        return;
      } catch (error) {
        await ctx.reply(
          "Sorry, there was an error stopping notifications. You may not be registered yet -- you can register via your profile in the app."
        );
        console.error("Error while stopping notifications:", error);
        return;
      }
    }
    await ctx.reply(`We need your Telegram username for us to help.`);
  }

  private async resume(ctx: CommandContext<Context>): Promise<void> {
    const telegramUsername = ctx.from?.username;

    if (telegramUsername) {
      try {
        // Lookup user by telegram name from database
        const user = await this.prismaClient.user.findFirst({
          where: { notificationUsername: telegramUsername },
        });

        if (!user) {
          throw new Error("User not registered.");
        }

        if (user.notificationsEnabled) {
          await ctx.reply(
            `Silly goose! Your notifications are already enabled!`
          );
          return;
        }

        await this.prismaClient.user.update({
          where: { id: user.id },
          data: {
            notificationsEnabled: true,
          },
        });

        await ctx.reply(
          `Done! If you want to stop notifications at any time enter /stop.`
        );
        return;
      } catch (error) {
        await ctx.reply(
          "Sorry, there was an error resuming notifications. You may not be registered yet -- you can register via your profile in the app."
        );
        console.error("Error while stopping notifications:", error);
        return;
      }
    }
    await ctx.reply(`We need your Telegram username for us to help.`);
  }

  private async setupBot(): Promise<void> {
    if (!this.bot) {
      throw new Error("Bot is not initialized");
    }

    this.bot.command("start", async (ctx) => {
      // The start parameter will be available in ctx.match when redirected from profile page
      const startParameter = ctx.match;

      if (startParameter) {
        this.register(ctx);
      } else {
        this.resume(ctx);
      }
    });

    this.bot.command("stop", async (ctx) => {
      this.stop(ctx);
    });

    this.bot.command("feedback", async (ctx) => {
      await ctx.reply(
        `Join the Cursive Support channel and talk with the team!`
      );
      await ctx.reply(`https://t.me/cursiveappsupport`);
    });

    this.bot.command("help", async (ctx) => {
      await ctx.reply(`/start : register or resume notifications.`);
      await ctx.reply(`/stop : stop notifications.`);
      await ctx.reply(`/feedback : chat with the Cursive team.`);
    });

    this.bot.on("message", async (ctx) => {
      await ctx.reply(
        `I don't recognize your command, I am just a notification bot (and connections elephant, obviously).`
      );
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
    throw Error("Unable to initialize Telegram client");
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

      if (!user.notificationsEnabled) {
        console.log("User has disabled notifications.");
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
