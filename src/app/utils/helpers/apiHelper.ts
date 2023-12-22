import axios, { AxiosRequestConfig } from "axios";
import {
  API_BASEURL,
  UNISAT_API_BASEURL,
  OKX_API_BASEURL,
} from "../constants/constants";
const CryptoJS = require("crypto-js");

export async function api(
  requestURL: string,
  requestMethod: string = "GET",
  data: any = {},
  headers: any = {}
): Promise<any> {
  // Define default headers
  const defaultHeaders = {
    "Content-Type": "application/json",
    // Add more default headers as needed
    // 'Authorization': 'Bearer your_token',
  };

  // Merge default headers with provided headers
  const mergedHeaders = { ...defaultHeaders, ...headers };

  const requestConfig: AxiosRequestConfig = {
    method: requestMethod,
    url: `${API_BASEURL}${requestURL}`,
    headers: mergedHeaders,
  };

  if (["POST", "PUT", "PATCH"].includes(requestMethod)) {
    requestConfig.data = data;
  } else if (requestMethod === "GET") {
    requestConfig.params = data;
  }

  try {
    const response = await axios(requestConfig);
    return response.data;
  } catch (error: any) {
    console.error(
      `Error making ${requestMethod.toUpperCase()} request:`,
      error
    );
    throw error;
  }
}

export async function unisatApi(
  requestURL: string,
  requestMethod: string = "GET",
  data: any = {},
  headers: any = {}
): Promise<any> {
  // Define default headers
  const defaultHeaders = {
    "Content-Type": "application/json",
    Authorization:
      "Bearer 37ebcf73c64cc31dbde44e043630aa6b077c2bba7f4ca49ab82d6c274d90f890",
  };

  // Merge default headers with provided headers
  const mergedHeaders = { ...defaultHeaders, ...headers };

  const requestConfig: AxiosRequestConfig = {
    method: requestMethod,
    url: `${UNISAT_API_BASEURL}${requestURL}`,
    headers: mergedHeaders,
  };

  if (["POST", "PUT", "PATCH"].includes(requestMethod)) {
    requestConfig.data = data;
  } else if (requestMethod === "GET") {
    requestConfig.params = data;
  }

  try {
    const response = await axios(requestConfig);
    return response.data;
  } catch (error: any) {
    console.error(
      `Error making ${requestMethod.toUpperCase()} request:`,
      error
    );
    throw error;
  }
}

export async function okxApi() {
  const OK_ACCESS_KEY = "09892827-c72b-48eb-8bb2-53c013d0afb3";
  const OK_ACCESS_TIMESTAMP = new Date().toISOString();
  const OK_ACCESS_PASSPHRASE = "";
  const SECRET_KEY = "";
  // const OK_ACCESS_SIGN = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(OK_ACCESS_TIMESTAMP + "POST" + "/api/v5/waas/transaction/get-sign-info", SECRET_KEY));

  const prehashString = `${OK_ACCESS_TIMESTAMP}POST/api/v5/waas/transaction/get-sign-info`;

  const OK_ACCESS_SIGN = CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA256(prehashString, SECRET_KEY)
  );
  console.log(OK_ACCESS_SIGN);

  const defaultHeaders = {
    "Content-Type": "application/json",
    "OK-ACCESS-PROJECT": "b9b8e08e163b0efc27f273dd3758e323",
    "OK-ACCESS-KEY": OK_ACCESS_KEY,
    "OK-ACCESS-PASSPHRASE": OK_ACCESS_PASSPHRASE,
    "OK-ACCESS-TIMESTAMP": OK_ACCESS_TIMESTAMP,
    "OK-ACCESS-SIGN": OK_ACCESS_SIGN,
  };

  axios
    .post(
      `${OKX_API_BASEURL}api/v5/waas/transaction/get-sign-info`,
      {
        addrFrom:
          "bc1psnr548clz3f4fz6jmpnw5eqzj2v2musk082wp8fvq5ac3p5ete6qg05u8u",
        addrTo:
          "bc1psnr548clz3f4fz6jmpnw5eqzj2v2musk082wp8fvq5ac3p5ete6qg05u8u",
        txAmount: "0", //fill in 0 here
        chainId: "0",
        extJson: {},
      },
      {
        headers: defaultHeaders, // Assuming defaultHeaders is defined elsewhere
      }
    )
    .then((response) => {
      console.log("Response data:", response.data);
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
}

export async function okxApi1(
  requestURL: string,
  requestMethod: string = "GET",
  data: any = {},
  headers: any = {}
): Promise<any> {
  const OK_ACCESS_KEY = "09892827-c72b-48eb-8bb2-53c013d0afb3";
  const OK_ACCESS_TIMESTAMP = new Date().toISOString();
  const OK_ACCESS_PASSPHRASE = "Uplink@123";
  const SECRET_KEY = "ED3E1B5323BB8AB4D5B42A56FDD40DB2";
  // const OK_ACCESS_SIGN = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(OK_ACCESS_TIMESTAMP + 'GET' + '/api/v5/account/balance?ccy=BTC', SECRET_KEY));

  const OK_ACCESS_SIGN = CryptoJS.enc.Base64.stringify(
    CryptoJS.HmacSHA256(
      OK_ACCESS_TIMESTAMP + "POST" + "/api/v5/waas/transaction/get-sign-info",
      SECRET_KEY
    )
  );

  // Define default headers
  const defaultHeaders = {
    "OK-ACCESS-KEY": OK_ACCESS_KEY,
    "OK-ACCESS-PASSPHRASE": OK_ACCESS_PASSPHRASE,
    "OK-ACCESS-TIMESTAMP": OK_ACCESS_TIMESTAMP,
    "OK-ACCESS-SIGN": OK_ACCESS_SIGN,
  };

  // Merge default headers with provided headers
  const mergedHeaders = { ...defaultHeaders, ...headers };

  const requestConfig: AxiosRequestConfig = {
    method: requestMethod,
    url: `${OKX_API_BASEURL}${requestURL}`,
    headers: mergedHeaders,
  };

  if (["POST", "PUT", "PATCH"].includes(requestMethod)) {
    requestConfig.data = data;
  } else if (requestMethod === "GET") {
    requestConfig.params = data;
  }

  try {
    const response = await axios(requestConfig);
    return response.data;
  } catch (error: any) {
    console.error(
      `Error making ${requestMethod.toUpperCase()} request:`,
      error
    );
    throw error;
  }
}
