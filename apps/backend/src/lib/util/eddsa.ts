import {
  signMessage,
  derivePublicKey,
  verifySignature,
} from "@zk-kit/eddsa-poseidon";
import { poseidon2 } from "poseidon-lite";
import { publicKeyFromString } from ".";
import { ChipPublicKeySignature } from "@types";

export const generateSignatureForPublicKey = (
  publicKey: string
): ChipPublicKeySignature => {
  const tapPubKey = publicKeyFromString(publicKey);
  let edwardsTapPubKey = tapPubKey.toEdwards();
  let poseidonTapPubKeyHash = poseidon2([
    edwardsTapPubKey.x,
    edwardsTapPubKey.y,
  ]);

  // Generate Cursive EdDSA key pair
  const cursivePrivKey = process.env.CURSIVE_BBJJ_PRIVATE_KEY_SEED!;
  const cursivePubKey = derivePublicKey(cursivePrivKey);
  const cursivePubKeyAx = cursivePubKey[0];
  const cursivePubKeyAy = cursivePubKey[1];
  // console.log(cursivePubKeyAx, cursivePubKeyAy);

  const cursivePubKeyAxHex = cursivePubKeyAx.toString(16);
  const cursivePubKeyAyHex = cursivePubKeyAy.toString(16);
  console.log("public key", cursivePubKeyAxHex, cursivePubKeyAyHex);
  // console.log(BigInt("0x" + cursivePubKeyAxHex) === cursivePubKeyAx);
  // console.log(BigInt("0x" + cursivePubKeyAyHex) === cursivePubKeyAy);

  // Generate Cursive EdDSA signature on tap public key
  const signature = signMessage(cursivePrivKey, poseidonTapPubKeyHash);
  const pubKeySignatureR8x = signature.R8[0];
  const pubKeySignatureR8y = signature.R8[1];
  const pubKeySignatureS = signature.S;
  const pubKeySignatureR8xHex = pubKeySignatureR8x.toString(16);
  const pubKeySignatureR8yHex = pubKeySignatureR8y.toString(16);
  const pubKeySignatureSHex = pubKeySignatureS.toString(16);
  console.log(verifySignature(poseidonTapPubKeyHash, signature, cursivePubKey));

  return {
    R8xHex: pubKeySignatureR8xHex,
    R8yHex: pubKeySignatureR8yHex,
    SHex: pubKeySignatureSHex,
  };
};
