import { api } from "../utils/helpers/apiHelper";

export async function getLuckyDrawUser(params: any) {
  try {
    let res = await api("lucky-draw", "GET", params);
    return res;
  } catch (err: any) {
    return err;
  }
}

export async function createLuckyDrawUser(params: any) {
    try {
      let res = await api("lucky-draw", "POST", params);
      return res;
    } catch (err: any) {
      return err;
    }
  }

export async function getLuckyDrawResult(params: any) {
  try {
    let res = await api("lucky-draw/draw", "POST", params);
    return res;
  } catch (err: any) {
    return err;
  }
}

export async function getLuckyDrawSummary() {
    try {
      let res = await api("lucky-draw/summary", "GET", {});
      return res;
    } catch (err: any) {
      return err;
    }
  }
