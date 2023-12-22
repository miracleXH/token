import { api, unisatApi } from "../utils/helpers/apiHelper";

export async function getTickerInfo() {
  try {
    let res = await unisatApi(
      `address/bc1p7fag0zshq7p2h66cyu2jm7t5psucz5mvyvtayls7qczmcmfql76s0yt46d/brc20/UPFI/info`,
      "GET"
    );
    return res;
  } catch (err: any) {
    return err;
  }
}

export async function getTransferarableInscriptions() {
  try {
    let res = await unisatApi(
      "indexer/address/bc1p7fag0zshq7p2h66cyu2jm7t5psucz5mvyvtayls7qczmcmfql76s0yt46d/brc20/UPFI/transferable-inscriptions",
      "GET",
      {},
      {
        Authorization: `Bearer 37ebcf73c64cc31dbde44e043630aa6b077c2bba7f4ca49ab82d6c274d90f890`,
      }
    );

    return res;
  } catch (err: any) {
    return err;
  }
}

export async function getHolders(params: any) {
  try {
    let res = await unisatApi(
      `brc20/${params.ticker}/holders?start=${params.start}&limit=${params.pageSize}`,
      "GET"
    );
    return res;
  } catch (err: any) {
    return err;
  }
}

// bitcoin balance only
export async function getAddressBalance(params: any) {
  try {
    let res = await unisatApi(
      `address/${params.address}/balance?limit=999999`,
      "GET"
    );
    return res;
  } catch (err: any) {
    return err;
  }
}

export async function getTickerInfoByAddress(params: any) {
  try {
    let res = await unisatApi(
      `address/${params.address}/brc20/${params.ticker}/info`,
      "GET"
    );
    return res;
  } catch (err: any) {
    return err;
  }
}

export async function getAirdropList() {
  try {
    let res = await api("getAirdropList", "GET", {});
    return res;
  } catch (err: any) {
    return err;
  }
}
