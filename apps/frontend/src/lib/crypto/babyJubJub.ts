// eslint-disable-next-line @typescript-eslint/no-require-imports
const elliptic = require("elliptic");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const BN = require("bn.js");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const ECSignature = require("elliptic/lib/elliptic/ec/signature");
// @ts-expect-error (ts2307)
import { ZqField } from "ffjavascript";
import * as hash from "hash.js";
import { sha256 } from "js-sha256";

// Define short Weierstrass parameters
const curveOptions = {
  p: "30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001",
  prime: null,
  a: "10216f7ba065e00de81ac1e7808072c9b8114d6d7de87adb16a0a72f1a91f6a0",
  b: "23d885f647fed5743cad3d1ee4aba9c043b4ac0fc2766658a410efdeb21f706e",
  g: [
    "1fde0a3cac7cb46b36c79f4c0a7a732e38c2c7ee9ac41f44392a07b748a0869f",
    "203a710160811d5c07ebaeb8fe1d9ce201c66b970d66f18d0d2b264c195309aa",
  ],
  gRed: false,
  n: "60c89ce5c263405370a08b6d0302b0bab3eedb83920ee0a677297dc392126f1",
  type: "short",
};

// Initialize Babyjubjub curve using short Weierstrass parameters
const ShortWeierstrassCurve = elliptic.curve.short;
const curve = new ShortWeierstrassCurve(curveOptions);
const ec = new elliptic.ec({
  curve: { curve, g: curve.g, n: curve.n, hash: hash.sha256 },
});
const baseField = new ZqField(
  "21888242871839275222246405745257275088548364400416034343698204186575808495617"
);
const scalarField = new ZqField(
  "2736030358979909402780800718157159386076813972158567259200215660948447373041"
);
const cofactor = 8;
const scalarFieldBitLength = 251;

export const babyjubjub: BabyJubJub = {
  ec,
  Fb: baseField,
  Fs: scalarField,
  cofactor,
  scalarFieldBitLength,
};

export interface CurvePoint {
  x: bigint;
  y: bigint;

  equals(other: CurvePoint): boolean;

  isInfinity(): boolean;

  toString(): string;
}

export class WeierstrassPoint implements CurvePoint {
  public x: bigint;
  public y: bigint;

  constructor(x: bigint, y: bigint) {
    this.x = x;
    this.y = y;
  }

  equals(other: CurvePoint): boolean {
    return (
      this.x.toString() === other.x.toString() &&
      this.y.toString() === other.y.toString()
    );
  }

  static infinity(): WeierstrassPoint {
    return new WeierstrassPoint(BigInt(0), BigInt(0));
  }

  isInfinity(): boolean {
    return this.x === BigInt(0) && this.y === BigInt(0);
  }

  // Converts from an elliptic.js curve point to a WeierstrassPoint
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromEllipticPoint(point: any): WeierstrassPoint {
    if (point.isInfinity()) {
      return this.infinity();
    }

    return new WeierstrassPoint(
      BigInt(point.getX().toString(10)),
      BigInt(point.getY().toString(10))
    );
  }

  // Based on conversion formulae: https://www-fourier.univ-grenoble-alpes.fr/mphell/doc-v5/conversion_weierstrass_edwards.html
  toEdwards(): EdwardsPoint {
    if (this.isInfinity()) {
      return EdwardsPoint.infinity();
    }

    const Fb = baseField;
    const malpha = Fb.div(BigInt(168698), BigInt(3));
    const mx = BigInt(Fb.sub(BigInt(this.x.toString()), malpha));
    const my = BigInt(this.y);

    const ex = Fb.div(mx, my);
    const ey = Fb.div(Fb.sub(mx, BigInt(1)), Fb.add(mx, BigInt(1)));
    return new EdwardsPoint(ex, ey);
  }

  toString(): string {
    return `Weierstrass: (${this.x.toString()}, ${this.y.toString()})`;
  }

  serialize(): string {
    return JSON.stringify({
      x: bigIntToHex(this.x),
      y: bigIntToHex(this.y),
    });
  }

  static deserialize(serialized: string): WeierstrassPoint {
    const { x, y } = JSON.parse(serialized);
    return new WeierstrassPoint(hexToBigInt(x), hexToBigInt(y));
  }
}

export class EdwardsPoint implements CurvePoint {
  public x: bigint;
  public y: bigint;

  constructor(x: bigint, y: bigint) {
    this.x = x;
    this.y = y;
  }

  equals(other: CurvePoint): boolean {
    return (
      this.x.toString() === other.x.toString() &&
      this.y.toString() === other.y.toString()
    );
  }

  static infinity(): EdwardsPoint {
    return new EdwardsPoint(BigInt(0), BigInt(1));
  }

  isInfinity(): boolean {
    return this.x === BigInt(0) && this.y === BigInt(1);
  }

  // Based on conversion formulae: https://www-fourier.univ-grenoble-alpes.fr/mphell/doc-v5/conversion_weierstrass_edwards.html
  toWeierstrass(): WeierstrassPoint {
    if (this.isInfinity()) {
      return WeierstrassPoint.infinity();
    }

    const Fb = baseField;
    const mA = BigInt(168698);
    const mB = BigInt(1);
    const mx = Fb.div(Fb.add(BigInt(1), this.y), Fb.sub(BigInt(1), this.y));
    const my = Fb.div(
      Fb.add(BigInt(1), this.y),
      Fb.mul(Fb.sub(BigInt(1), this.y), this.x)
    );

    const sx = Fb.div(Fb.add(mx, Fb.div(mA, BigInt(3))), mB);
    const sy = Fb.div(my, mB);

    return new WeierstrassPoint(sx, sy);
  }

  toString(): string {
    return `Edwards: (${this.x.toString()}, ${this.y.toString()})`;
  }

  serialize(): string {
    return JSON.stringify({
      x: bigIntToHex(this.x),
      y: bigIntToHex(this.y),
    });
  }

  static deserialize(serialized: string): EdwardsPoint {
    const { x, y } = JSON.parse(serialized);
    return new EdwardsPoint(hexToBigInt(x), hexToBigInt(y));
  }
}

/**
 * Compute the hash of a message using the ECDSA algorithm
 * @param msg
 * @returns hash as a hex string
 */
export const getECDSAMessageHash = (msg: string): string => {
  if (!isHexString(msg)) {
    throw new Error("Message must be a hex string to hash!");
  }

  const msgBuffer = Buffer.from(msg, "hex");
  const hasher = sha256.create();
  const hash = hasher.update(msgBuffer).hex();

  // As part of the ECDSA algorithm, we truncate the hash to its left n bits,
  // where n is the bit length of the order of the curve.
  // Truncation includes any leading zeros, so we first pad the hash to the full digest length
  const HASH_DIGEST_LENGTH = 256;
  const hashBits = hexToBigInt(hash)
    .toString(2)
    .padStart(HASH_DIGEST_LENGTH, "0");
  const truncatedBits = hashBits.slice(0, babyjubjub.scalarFieldBitLength);
  const msgHash = BigInt("0b" + truncatedBits);

  return bigIntToHex(msgHash);
};

// This addresses a quirk of the ellptic.js library where
// the message hash is truncated oddly. For some reason, the
// truncation is based on the byte length of the message hash * 8
// rather than the bit length, which means the truncation is
// incorrect when we have a message hash that is not a multiple
// of 8 bits. This addresses that issue by padding the message
// with some zeros which will be truncated by the library.
// https://github.com/indutny/elliptic/blob/43ac7f230069bd1575e1e4a58394a512303ba803/lib/elliptic/ec/index.js#L82
const padECDSAMessageHash = (msgHash: string): string => {
  let msgHashPadded = hexToBigInt(msgHash);
  const msgHashBN = new BN(msgHash, 16);
  const delta = msgHashBN.byteLength() * 8 - babyjubjub.ec.n.bitLength();

  // Given that we expect the message hash to be truncated to at most 251 bits,
  // the following condition is only true if delta is equal to 5
  if (delta > 0) {
    msgHashPadded = BigInt(
      "0b" + msgHashPadded.toString(2) + "0".repeat(delta)
    );
  }

  return bigIntToHex(msgHashPadded);
};

/**
 * Generates a new key pair for the baby jubjub curve
 * @returns verifyingKey, signingKey (pubKey and privKey)
 */
export const generateSignatureKeyPair = (): {
  signingKey: string;
  verifyingKey: string;
} => {
  const keyPair = babyjubjub.ec.genKeyPair();

  const pubKey = keyPair.getPublic();
  const privKey = keyPair.getPrivate();

  return {
    verifyingKey: pubKey.encode("hex"),
    signingKey: privKey.toString("hex"),
  };
};

/**
 * Signs a message using the baby jubjub curve
 * @param signingKey - The private key, hex encoded
 * @param data - The message to sign
 * @returns The signature in DER format, hex encoded
 */
export const sign = (signingKey: string, data: string): string => {
  const key = babyjubjub.ec.keyFromPrivate(signingKey, "hex");
  const msgHash = getECDSAMessageHash(data);
  const paddedMsgHash = padECDSAMessageHash(msgHash); // See comment on padECDSAMessageHash - only needed for elliptic.js
  const signature = key.sign(paddedMsgHash, "hex", {
    canonical: true,
  });
  const signatureDER = signature.toDER();
  return Buffer.from(signatureDER).toString("hex");
};

/**
 * Verifies an ECDSA signature on the baby jubjub curve
 * @param verifyingKey - The public key of the signer, hex encoded
 * @param data - The message that was signed
 * @param signature - The signature in DER format, hex encoded
 * @returns boolean indicating whether or not the signature is valid
 */
export const verify = (
  verifyingKey: string,
  data: string,
  signature: string
): boolean => {
  const key = babyjubjub.ec.keyFromPublic(verifyingKey, "hex");
  const msgHash = getECDSAMessageHash(data);
  const paddedMsgHash = padECDSAMessageHash(msgHash); // See comment on padECDSAMessageHash - only needed for elliptic.js
  const sig = derDecodeSignature(signature);
  return babyjubjub.ec.verify(
    paddedMsgHash,
    new ECSignature({
      r: sig.r.toString(16),
      s: sig.s.toString(16),
    }),
    key
  );
};

/**
 * Converts a private key to a public key on the baby jubjub curve
 * @param privKey - The private key to convert
 * @returns The public key in Short Weierstrass form
 */
export const privateKeyToPublicKey = (privKey: bigint): WeierstrassPoint => {
  const pubKeyPoint = babyjubjub.ec.g.mul(privKey.toString(16));

  return WeierstrassPoint.fromEllipticPoint(pubKeyPoint);
};

/**
 * Checks if a string is a hex string
 * @param str - The string to check
 * @returns Whether or not the string is a hex string
 */
export const isHexString = (str: string): boolean => {
  return /^[0-9a-fA-F]+$/.test(str);
};

/**
 * DER decodes a signature
 * @param encodedSig - The encoded signature
 * @returns - The decoded signature
 */
export const derDecodeSignature = (encodedSig: string): Signature => {
  const r_length = parseInt(encodedSig.slice(6, 8), 16) * 2; // Multiply by 2 to get length in hex characters
  const s_length =
    parseInt(encodedSig.slice(10 + r_length, 12 + r_length), 16) * 2;

  const r = encodedSig.slice(8, 8 + r_length);
  const s = encodedSig.slice(12 + r_length, 12 + r_length + s_length);

  return { r: hexToBigInt(r), s: hexToBigInt(s) };
};

/**
 * Converts a public key in hex form to a WeierstrassPoint
 * Reference for key format: https://en.bitcoin.it/wiki/Elliptic_Curve_Digital_Signature_Algorithm
 * @param pubKey - The public key in hex form
 * @returns The public key in Weierstrass form
 */
export const publicKeyFromString = (pubKey: string): WeierstrassPoint => {
  if (pubKey.slice(0, 2) !== "04") {
    throw new Error("Only handle uncompressed public keys for now");
  }

  const pubKeyLength = pubKey.length - 2;
  const x = hexToBigInt(pubKey.slice(2, 2 + pubKeyLength / 2));
  const y = hexToBigInt(pubKey.slice(2 + pubKeyLength / 2));

  return new WeierstrassPoint(x, y);
};

export const hexToBigInt = (hex: string): bigint => {
  return BigInt(`0x${hex}`);
};

export const bigIntToHex = (bigInt: bigint): string => {
  return bigInt.toString(16);
};

export const hexToBytes = (hex: string): Uint8Array => {
  let zeroPaddedHex = hex;
  if (hex.length % 2 !== 0) {
    zeroPaddedHex = "0" + hex;
  }

  return Uint8Array.from(
    zeroPaddedHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16))
  );
};

export const bytesToHex = (bytes: Uint8Array): string => {
  return bytes.reduce(
    (str, byte) => str + byte.toString(16).padStart(2, "0"),
    ""
  );
};

export const bytesToBigInt = (bytes: Uint8Array): bigint => {
  return hexToBigInt(bytesToHex(bytes));
};

export const bigIntToBytes = (bigInt: bigint): Uint8Array => {
  return hexToBytes(bigIntToHex(bigInt));
};

export type BabyJubJub = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ec: any;
  Fb: ZqField;
  Fs: ZqField;
  cofactor: number;
  scalarFieldBitLength: number;
};

export type Signature = {
  r: bigint;
  s: bigint;
};
