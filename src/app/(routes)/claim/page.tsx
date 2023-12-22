'use client'

import { useState, useEffect } from 'react';
import { getTransferarableInscriptions, getTickerInfo } from '@/api/unisat';

export default function Claim() {
    const [inscriptions, setInscriptions] = useState([]);

    const init = async () => {
        let x = await getTransferarableInscriptions();
        // console.log(x);
        console.log(await getTickerInfo());
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <div className="min-h-screen"></div>
    )
}