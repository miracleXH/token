// const walletProvider = localStorage.getItem("walletProvider");

declare let window: any;

export async function connectWallet() {
  const ethereum = window.ethereum || undefined;
  const unisat = window.unisat || undefined;
  const btc = window.btc || undefined;
  const okxwallet = window.okxwallet || undefined;

  const walletProvider = localStorage.getItem("walletProvider");

  let walletAddress:any = [];

  if (walletProvider === "unisat") {
    walletAddress = await unisat?.requestAccounts();
    // let accounts = await unisat.getAccounts();
  } else if (walletProvider === "leather") {
    const response = await btc?.request("getAddresses");

    walletAddress = response.result.addresses.find(
      (address: any) => address.type === "p2wpkh"
    )?.address;
  } else if (walletProvider === "okx") {
    let walletData = await okxwallet.bitcoin.connect();
    walletAddress.push(walletData.address);
    console.log(walletAddress);
  } else {
  }

  return walletAddress;
}

export function checkHasWalletInstalled() {
  const ethereum = window.ethereum;
  const unisat = window.unisat;
  const btc = window.btc;
  const okxwallet = window.okxwallet;

  const walletProvider = localStorage.getItem("walletProvider");
  let walletProviderData = {
    isInstalled: true,
    downloadUrl: "",
  };

  if (walletProvider === "unisat") {
    if (unisat === undefined) {
      walletProviderData = {
        isInstalled: false,
        downloadUrl: "https://unisatwallet.io/download",
      };
    }
  } else if (walletProvider === "leather") {
    if (btc === undefined) {
      walletProviderData = {
        isInstalled: false,
        downloadUrl: "https://leather.io/install-extension",
      };
    }
  } else if (walletProvider === "okx") {
    if (okxwallet === undefined) {
      walletProviderData = {
        isInstalled: false,
        downloadUrl: "https://okx.network",
      };
    }
  } else {
  }

  return walletProviderData;
}
