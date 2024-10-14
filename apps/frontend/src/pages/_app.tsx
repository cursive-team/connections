import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { toast, Toaster } from "sonner";
import { DM_Sans } from "next/font/google";
import { useRouter } from "next/router";
import { Analytics } from "@vercel/analytics/react";
import { logoutUser } from "@/lib/auth";
import { storage } from "@/lib/storage";
import { useEffect, useState } from "react";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

// Signature public keys for pre-migration users
const preMigrationSignaturePublicKeys: string[] = [
  "0404849088a1bfca2742634aede380f1cf47eac2158d32b1c253ef9746889ac7c4065ad6155273268dccf40cc4f668ac40dfd9850142700a75108ae3729548dcc6",
  "040a4837d6d2df53351483bbbf74a217f80fe9c97da1f09b97f4c9ee1ed6d3c5c82de64f12907abc39c0447c5e8ed9bfb0c7ef3ee6c89c44161e12a3bf838c61ad",
  "04249652ca7720b50b0cf27b3919825253a9c026c63a1aefe5fa87c73200687e5708205c3b1d5940ba7bf75bc83ff36c70e76e151a71fe8ced328c194fd4ed0e4c",
  "042df60a372a4df50beea2c5972fa34fdf8ef3a81f83178fdf57d7c2809b9c46432539e82f920dc51fad9aaacd6e46fab623d0bc6e5f89980fc09882573b1b6fcf",
  "0406c38d492526c722ab90f56e1be47f4752e16b1f829967163c98ed3852ab03c8118fb908451803b2f5524f351fb706498e9c58b181a41ed4197022b694d10549",
  "041b9f5788851d67786a86c2370119e017bc9134c154fd0f6fadc10a58e916a8e93062ae5325f0a0e02d31e54db27dd3e9b3bc4634bab7049f8708e5186839ff14",
  "041a43a706db628b190d6e48decde5cf6fae3e43f9d31128dd416f92024d4a1882302f24fe17b5ea7bf61def39df9d43198130f3f28c005d9c305213e8f7a28e59",
  "0421afb426c1572cf1b63388b779f306113e49b5f85f815cf9ef5db5cc6b64b97a29da42b5ad54f67b718ea47fe72972d218bbacab045dbbbc95b739121455a060",
  "0408feec4886797bb17d555738a198dd87238c4625f4340da9cb5570183a41913e196f39f6d629333e7a77f045415c186d2ccd9d03f5747b9d46328549d4ed5160",
  "040a851004cca2134ac0fc3bf0a6fed0a5307a6e6b90058fbb9cf310e2739d13f70bd1b5dbd157fb778bcbad124afe553831b19df38ea8caf7d8172fb37d3547e3",
  "0407f387b87a83da69e33a2ce136111bb358fd4ab892b3158f860398b0a6d7503d1b1d31bb6418fc321db98480008f1561c579f73ba65055fad00492dae1fd046e",
  "0422b259769fb3e7a6e256fcd88688b59958c0c6f9287008dbc9478581645aab490395bebe301acccc354a2284ad2b53b4f08ea745e29bec6bc90948079e4bd32a",
  "04162f542c078f21336de4a8a90a83853052e60d6cb2389767d3ab13353f90195c1f4fcad8d550efb4c3c68f6eb74986e76b9c53d9b78c2b28f9801d7f099a67c6",
  "041bf6195b26573ac0c3f4b976477341359e35ee72c1be1458d177528bd78808b527f786b6599322ff06a6e4db84a6c59150f3ccf8ea1585da8f78ff57fa24367f",
  "04255477c78a05f75be9a2a2ea358301a5a61d91e1019c49a1d180c918403545b11fc4e9bf0d9a85f075d78dfbcf5bc0e3bcddae24d2535c7ff81c0876b8ea59c0",
  "04230af5e2e0670d7dceac62cd6d2a57138f07b7c949adc9dc3dad01bc2832801519330e654c68e9423e92f55aa0e27b3a98bd876e98ff1086ec4788f3dc640758",
  "0414d6ae3bbfec5102073eb828d68f73fd2e6c8702de3ea9d3babdfd30593d62c62ca7b32673c5ec451d8697c2640a644d46250d4dad9ba73fb5b7f0e3985c06fd",
  "042c4bd43f5ef8872a2554086d13776dcbde434b1c8794ed2edc9e7ff0474eeaaf201d83bd0536f7edc8eb47d5ad70d24ec15fcf50544e6b18b51a3d3b23139672",
  "04305126cee2148f14e471462a72fcd631eba928ce9671a06b44129d99f98cb46d1ab20b61aea9628c3179d96a64ae73a0684ca9404d9e024a5a4f863ff853c002",
  "04258611f3270e6cf17339591c336e1450532219b668419328de6c76a5ea4c91540c5751574e6ea33d18d033c71c2e1ce052bd16de52d5ba454f7247d0fcb6638d",
  "04304da0518e6aad0d4292b7c658304371b73d1ef0646254933be9cd390ac19a321256851fa780dbf53308e8359a2a3f11f621fb73f9205323f2ea51db47bc1888",
];

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isPreMigrationSessionChecked, setIsPreMigrationSessionChecked] =
    useState(false);

  // Check if the user is a pre-migration user and logout if so
  useEffect(() => {
    const checkSession = async () => {
      const MIGRATION_CHECK_STORAGE_KEY = "preMigrationSessionChecked";
      // Check if we've already performed this check
      const hasAlreadyChecked = localStorage.getItem(
        MIGRATION_CHECK_STORAGE_KEY
      );
      if (hasAlreadyChecked) {
        setIsPreMigrationSessionChecked(true);
        return;
      }

      const user = await storage.getUser();
      if (
        user &&
        preMigrationSignaturePublicKeys.includes(
          user.userData.signaturePublicKey
        )
      ) {
        await logoutUser();
        toast(
          "You registered early! Please tap your chip to register for the main experience.",
          {
            duration: 5000,
            className:
              "font-sans text-iron-950 dark:text-iron-50 bg-white dark:bg-iron-800",
          }
        );
        router.push("/");
      }

      // Mark that we've performed the check
      localStorage.setItem(MIGRATION_CHECK_STORAGE_KEY, "true");
      setIsPreMigrationSessionChecked(true);
    };

    if (!isPreMigrationSessionChecked) {
      checkSession();
    }
  }, [router, isPreMigrationSessionChecked]);

  return (
    <main className={dmSans.className}>
      <Component {...pageProps} />
      <Analytics />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 5000,
          className: "font-sans text-iron-950",
        }}
      />
    </main>
  );
}
