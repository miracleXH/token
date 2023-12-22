import { api } from "../utils/helpers/apiHelper";

export async function getPresaleTime() {
  try {
    let res = await api("presale-time", "GET");
    return res;
  } catch (err: any) {
    return err;
  }
}

export async function getData(params: any) {
  try {
    let res = await api("data", "GET", params);
    return res;
  } catch (err: any) {
    return err;
  }
}

export async function donate(params: any) {
  try {
    let res = await api("donation", "POST", params, {
      Authorization: localStorage.getItem("jwtToken"),
    });
    return res;
  } catch (err: any) {
    return err;
  }
}

export async function getAccountAddress() {
  try {
    let res = await api("account-address", "GET");
    return res;
  } catch (err: any) {
    return err;
  }
}

export async function checkDonation(params: any) {
  try {
    let res = await api("donation/check", "GET", params, {
      Authorization: localStorage.getItem("jwtToken"),
    });

    return res;
  } catch (err: any) {
    return err;
  }
}

export async function getProfile(params: any) {
  try {
    let res = await api("user", "GET", params);
    return res;
  } catch (err: any) {
    return err;
  }
}

export async function createUser(params: any) {
  try {
    let data = await api("user", "POST", params);
    return data;
  } catch (err: any) {
    return err;
  }
}

export async function verifyReferralCode(params: any) {
  try {
    let res = await api("user/referral-code/verify", "GET", params);
    return res;
  } catch (err: any) {
    return err;
  }
}

export async function getReferralsData(params: any) {
  try {
    let res = await api("user/referrals", "GET", params);
    return res;
  } catch (err: any) {
    return err;
  }
}

export async function getCountryCode() {
  try {
    const request = await fetch("https://ipinfo.io/json?token=f4cd2a0635aa0a");
    const res = await request.json();
    return res;
  } catch (err: any) {
    return err;
  }
}
