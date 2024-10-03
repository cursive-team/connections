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
      Source: process.env.AWS_SES_SENDER_EMAIL!,
      Destination: {
        ToAddresses: [signinToken.email],
      },
      Message: {
        Subject: {
          Data: "Your Cursive Sign-in Code",
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: `<html>
                           <body>
                             <h1>Sign-in Code</h1>
                             <p>Your sign-in code is: <strong>${signinToken.value}</strong></p>
                             <p>This code will expire in 15 minutes.</p>
                           </body>
                         </html>`,
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
