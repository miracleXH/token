// btc-wallet.ts

import { bip39 } from "@okxweb3/crypto-lib";
import { BtcWallet } from "@okxweb3/coin-bitcoin";

interface BTCWalletData {
  mnemonic: string;
  derivedPrivateKey: string;
  derivedPath: string;
  newAddress: string;
}

class BTCWalletHelper {
  private wallet: BtcWallet;

  constructor() {
    // Initialization logic if needed
    this.wallet = new BtcWallet();
  }

  async generateBTCWalletData() {
    try {
      // Generate mnemonic
      let mnemonic = await bip39.generateMnemonic();
      console.log("Generated mnemonic:", mnemonic);

      // Get derived key
      const hdPath = await this.wallet.getDerivedPath({
        index: 0,
        segwitType: 4,
      });
      let derivePrivateKey = await this.wallet.getDerivedPrivateKey({
        mnemonic,
        hdPath,
      });
      console.log(
        "Generated derived private key:",
        derivePrivateKey,
        ", derived path:",
        hdPath
      );

      // Get new address
      let newAddress = await this.wallet.getNewAddress({
        privateKey: derivePrivateKey,
        addressType: "segwit_taproot",
      });
      console.log("Generated new address:", newAddress.address);

      // Return the generated data or handle it as needed
      return {
        mnemonic,
        // derivedPrivateKey,
        derivedPath: hdPath,
        newAddress: newAddress.address,
      };
    } catch (error) {
      // Handle errors appropriately
      console.error("Error generating BTC wallet data:", error);
      throw error;
    }
  }
}

export default new BTCWalletHelper();
