import { bip39, BigNumber } from "@okxweb3/crypto-lib";
import { BtcWallet } from "@okxweb3/coin-bitcoin";
import { sign } from "crypto";

export async function verifyBTCWallet(walletAddress: string) {
  // Assuming you have the following variables defined
  const wallet = new BtcWallet();
  const mnemonic = await bip39.generateMnemonic();
  const hdPath = await wallet.getDerivedPath({ index: 0, segwitType: 4 });
  const derivePrivateKey = await wallet.getDerivedPrivateKey({
    mnemonic,
    hdPath,
  });
  const newAddress = await wallet.getNewAddress({
    privateKey: derivePrivateKey,
    addressType: "segwit_taproot",
  });

  // Verify the BTC wallet address
  let valid = await wallet.validAddress({
    address: walletAddress,
  });

  console.log("Verify address isValid:", valid.isValid);

  // Sign a transaction
  let signParams = {
    privateKey: derivePrivateKey,
    data: {
      to: newAddress.address,
      value: new BigNumber(0),
      nonce: 5,
      gasPrice: new BigNumber(100 * 1000000000),
      gasLimit: new BigNumber(21000),
      chainId: 42,
    },
  };

  let signedTx = await wallet.signTransaction(signParams);
  console.log("signed tx:", signedTx);

  // return signedTx;
}
