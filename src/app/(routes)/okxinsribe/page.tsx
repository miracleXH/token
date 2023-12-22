'use client';

import { useEffect, useState } from "react";
import { getSignInfo } from "@/api/okx";

export default function OkxInscribe() {

    const init = async () => {
        const requestData = {
            addrFrom: "bc1psnr548clz3f4fz6jmpnw5eqzj2v2musk082wp8fvq5ac3p5ete6qg05u8u",
            addrTo: "bc1psnr548clz3f4fz6jmpnw5eqzj2v2musk082wp8fvq5ac3p5ete6qg05u8u",
            txAmount: "0",//fill in 0 here
            chainId: "0",
            extJson: {}
        }

        let res = getSignInfo(requestData)
    }

    useEffect(() => {
        init()
    }, [])

    return (
        <div className="min-h-screen"></div>
    )
}