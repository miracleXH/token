import { okxApi } from "../utils/helpers/apiHelper";

export async function getSignInfo(requestBody: any) {
    try {
      let res = await okxApi();
      return res;
    } catch (err: any) {
      return err;
    }
}
