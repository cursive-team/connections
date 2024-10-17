import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { SigninToken } from "@/lib/controller/postgres/types";
import { iEmailClient } from "@/lib/controller/email/interfaces";

export class SESEmailClient implements iEmailClient {
  private sesClient: SESClient;

  constructor() {
    this.sesClient = new SESClient({
      region: process.env.AWS_REGION!,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async EmailSigninToken(signinToken: SigninToken): Promise<void> {
    const emailParams = {
      Source: `"Cursive" <${process.env.AWS_SES_SENDER_EMAIL!}>`,
      Destination: {
        ToAddresses: [signinToken.email],
      },
      Message: {
        Subject: {
          Data: "Cursive Connections Sign-in Code",
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: `
              <!DOCTYPE html>
              <html lang="en">
                <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Cursive Connections Sign-in Code</title>
                  <style>
                    body {
                      font-family: 'Helvetica Neue', Arial, sans-serif;
                      line-height: 1.6;
                      color: #fffff;
                      background-color: #f4f4f4;
                      margin: 0;
                      padding: 0;
                    }
                    .container {
                      max-width: 600px;
                      margin: 40px auto;
                      padding: 30px;
                      background-color: #ffffff;
                      border-radius: 8px;
                      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                      color: #ffffff;
                      font-size: 24px;
                      margin-bottom: 20px;
                      text-align: center;
                    }
                    .code {
                      font-size: 32px;
                      font-weight: bold;
                      color: #fffff;
                      text-align: center;
                      padding: 15px;
                      background-color: #f8f9fa;
                      border-radius: 4px;
                      margin: 20px 0;
                      letter-spacing: 5px;
                    }
                    .expiry {
                      text-align: center;
                      font-size: 14px;
                      color: #ffffff;
                      margin-top: 20px;
                    }
                  </style>
                </head>
                <body>
                  <div class="container">
                    <h1>Your 6-digit code</h1>
                    <div class="code">${signinToken.value}</div>
                    <p class="expiry">This code will expire in 15 minutes.</p>
                  </div>
                </body>
              </html>
            `,
            Charset: "UTF-8",
          },
        },
      },
    };

    try {
      const command = new SendEmailCommand(emailParams);
      await this.sesClient.send(command);

      return;
    } catch (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send signin code email");
    }
  }
}
